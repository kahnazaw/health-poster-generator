import { useState, useRef } from "react";
import { useLocation } from "wouter";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { GeneratorForm } from "@/components/GeneratorForm";
import { PosterPreview } from "@/components/PosterPreview";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { LogOut, Archive, User, Settings } from "lucide-react";
import logoUrl from "@/assets/logo.png";

interface PosterContent {
  title: string;
  points: string[];
  slug?: string;
}

interface ApprovedTopic {
  id: number;
  slug: string;
  title: string;
  points: string[];
}

export default function Home() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [posterContent, setPosterContent] = useState<PosterContent | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [centerName, setCenterName] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);
  
  const { user, logout, isLoading: authLoading, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: topics } = useQuery<ApprovedTopic[]>({
    queryKey: ["/api/topics"],
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { topicId: number; centerName: string }) => {
      const res = await apiRequest("POST", "/api/posters", { 
        ...data, 
        orientation 
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "فشل إنشاء البوستر");
      }
      return res.json();
    },
    onSuccess: (data) => {
      const topic = topics?.find(t => t.id === selectedTopicId);
      setPosterContent({
        ...data.content,
        slug: topic?.slug,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posters/archive"] });
      toast({
        title: "تم التوليد بنجاح!",
        description: "تم إنشاء البوستر من المحتوى المعتمد.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = (data: { topicId: number; centerName: string }) => {
    if (!user) {
      toast({
        title: "يرجى تسجيل الدخول",
        description: "يجب تسجيل الدخول لإنشاء بوستر",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }
    generateMutation.mutate(data);
  };

  const handleTopicChange = (topicId: number) => {
    setSelectedTopicId(topicId);
    setGeneratedImage(null);
    const topic = topics?.find(t => t.id === topicId);
    if (topic) {
      setPosterContent({
        title: topic.title,
        points: topic.points,
        slug: topic.slug,
      });
    }
  };

  const handleGenerateImage = async () => {
    if (!posterContent) return;
    
    setIsGeneratingImage(true);
    try {
      const prompt = `Create a simple, clean health infographic illustration for: "${posterContent.title}". 
Style: Modern flat design, medical/health theme, simple icons, pastel colors, Arabic-friendly design.
The image should be suitable for a health awareness poster. No text in the image.`;
      
      const res = await apiRequest("POST", "/api/generate-image", {
        prompt,
        size: "512x512"
      });
      
      if (!res.ok) {
        throw new Error("فشل توليد الصورة");
      }
      
      const data = await res.json();
      if (data.b64_json) {
        setGeneratedImage(`data:image/png;base64,${data.b64_json}`);
        toast({
          title: "تم توليد الصورة",
          description: "تمت إضافة صورة توضيحية للبوستر",
        });
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "خطأ",
        description: "فشل توليد الصورة التوضيحية",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;

    try {
      toast({
        title: "جاري التحضير...",
        description: "يتم الآن تجهيز ملف PDF للتحميل.",
      });

      const element = posterRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      
      const pdf = new jsPDF({
        orientation: orientation,
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`poster-${Date.now()}.pdf`);

      toast({
        title: "تم التحميل",
        description: "تم حفظ ملف البوستر بنجاح.",
      });
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast({
        title: "فشل التحميل",
        description: "تعذر إنشاء ملف PDF.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({ title: "تم تسجيل الخروج" });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
        <div className="animate-pulse text-slate-500">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16">
                <img src={logoUrl} alt="شعار دائرة صحة كركوك" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-display">منصة التوعية الصحية</h1>
                <p className="text-sm text-slate-500">دائرة صحة كركوك - قطاع كركوك الأول - وحدة تعزيز الصحة</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </div>
                  {isAdmin && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => setLocation("/dashboard")}
                      data-testid="button-dashboard"
                    >
                      <Settings className="w-4 h-4 ml-2" />
                      لوحة التحكم
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation("/archive")}
                    data-testid="button-archive"
                  >
                    <Archive className="w-4 h-4 ml-2" />
                    الأرشيف
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation("/login")}
                    data-testid="button-login"
                  >
                    تسجيل الدخول
                  </Button>
                  <Button 
                    onClick={() => setLocation("/register")}
                    data-testid="button-register"
                  >
                    إنشاء حساب
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-6">
            <GeneratorForm 
              onGenerate={handleGenerate}
              onOrientationChange={setOrientation}
              onDownload={handleDownload}
              onGenerateImage={handleGenerateImage}
              orientation={orientation}
              isGenerating={generateMutation.isPending}
              isGeneratingImage={isGeneratingImage}
              hasContent={!!posterContent}
              hasImage={!!generatedImage}
              selectedTopicId={selectedTopicId}
              onTopicChange={handleTopicChange}
              centerName={centerName}
              onCenterNameChange={setCenterName}
            />
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <h4 className="font-bold mb-1">تنبيه رسمي</h4>
              <p className="opacity-90">
                هذه الرسالة أُعدّت وفق توجيهات وزارة الصحة العراقية. جميع النصوص معتمدة رسمياً.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
              <div className="bg-slate-50 rounded-xl p-4 md:p-8 flex items-center justify-center min-h-[600px] lg:min-h-[800px] overflow-hidden relative">
                
                <div className="absolute inset-0 opacity-[0.03]" 
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                />

                <PosterPreview
                  ref={posterRef}
                  orientation={orientation}
                  centerName={centerName}
                  generatedContent={posterContent}
                  isLoading={generateMutation.isPending}
                  generatedImage={generatedImage}
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-sm text-slate-500 px-2">
              <p>معاينة حية - A4 {orientation === 'portrait' ? 'عمودي' : 'أفقي'}</p>
              <p>210 × 297 مم</p>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
