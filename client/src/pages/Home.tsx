import { useState, useRef } from "react";
import { useLocation } from "wouter";
import html2canvas from "html2canvas";
import { GeneratorForm } from "@/components/GeneratorForm";
import { PosterPreview } from "@/components/PosterPreview";
import { DailyHealthTip } from "@/components/DailyHealthTip";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { LogOut, Archive, User, Settings, Share2, MessageCircle, Send, Sparkles, Heart, Image, FileDown } from "lucide-react";
import { SiWhatsapp, SiTelegram } from "react-icons/si";
import logoUrl from "@/assets/logo.png";
import ministryLogoUrl from "@/assets/ministry-logo.png";

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

export type ColorTheme = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  gradient: string;
  bg: string;
};

export const colorThemes: ColorTheme[] = [
  { id: "teal-gold", name: "تركوازي ذهبي", primary: "#0d9488", secondary: "#f59e0b", gradient: "from-teal-500 to-amber-500", bg: "#f0fdfa" },
  { id: "blue-purple", name: "أزرق بنفسجي", primary: "#3b82f6", secondary: "#8b5cf6", gradient: "from-blue-500 to-purple-500", bg: "#eff6ff" },
  { id: "green-emerald", name: "أخضر طبي", primary: "#059669", secondary: "#10b981", gradient: "from-green-600 to-emerald-500", bg: "#ecfdf5" },
  { id: "red-rose", name: "أحمر وردي", primary: "#dc2626", secondary: "#f43f5e", gradient: "from-red-500 to-rose-500", bg: "#fef2f2" },
  { id: "indigo-sky", name: "نيلي سماوي", primary: "#4f46e5", secondary: "#0ea5e9", gradient: "from-indigo-500 to-sky-500", bg: "#eef2ff" },
  { id: "orange-yellow", name: "برتقالي أصفر", primary: "#ea580c", secondary: "#eab308", gradient: "from-orange-500 to-yellow-500", bg: "#fff7ed" },
];

export default function Home() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [posterContent, setPosterContent] = useState<PosterContent | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [centerName, setCenterName] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>(colorThemes[0]);
  const posterRef = useRef<HTMLDivElement>(null);
  
  const { user, logout, isLoading: authLoading, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { playSound } = useSound();
  const { language, t, dir } = useLanguage();

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

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const isIOSDevice = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;

    try {
      playSound("click");
      toast({
        title: t("جاري التحضير...", "Preparing..."),
        description: t("يتم الآن تجهيز ملف PDF للتحميل.", "Preparing PDF for download."),
      });

      const posterHtml = posterRef.current.outerHTML;
      
      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
          } catch {
            return '';
          }
        })
        .join('\n');

      const fullHtml = `<style>${styles}</style>${posterHtml}`;

      const response = await fetch('/api/export-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: fullHtml,
          format: 'pdf',
          orientation: orientation
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const filename = `poster-${Date.now()}.pdf`;

      if (isMobileDevice() && navigator.share && navigator.canShare) {
        const file = new File([blob], filename, { type: 'application/pdf' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: t("بوستر صحي", "Health Poster"),
            });
            toast({
              title: t("تم المشاركة", "Shared"),
              description: t("اختر 'حفظ في الملفات' لتنزيل الملف.", "Choose 'Save to Files' to download."),
            });
            playSound("success");
            return;
          } catch (shareError) {
            if ((shareError as Error).name === 'AbortError') {
              return;
            }
          }
        }
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      
      playSound("success");
      toast({
        title: t("تم التحميل", "Download Complete"),
        description: t("تم حفظ ملف البوستر بنجاح.", "Poster file saved successfully."),
      });
    } catch (error) {
      console.error("PDF Generation Error:", error);
      playSound("error");
      toast({
        title: t("فشل التحميل", "Download Failed"),
        description: t("تعذر إنشاء ملف PDF.", "Could not create PDF file."),
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = async () => {
    if (!posterRef.current) return;

    try {
      playSound("click");
      toast({
        title: t("جاري التحضير...", "Preparing..."),
        description: t("يتم الآن تجهيز الصورة للتحميل.", "Preparing image for download."),
      });

      const posterHtml = posterRef.current.outerHTML;
      
      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
          } catch {
            return '';
          }
        })
        .join('\n');

      const fullHtml = `<style>${styles}</style>${posterHtml}`;

      const response = await fetch('/api/export-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: fullHtml,
          format: 'png',
          orientation: orientation
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const filename = `poster-${Date.now()}.png`;

      if (isMobileDevice() && navigator.share && navigator.canShare) {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: t("بوستر صحي", "Health Poster"),
            });
            toast({
              title: t("تم المشاركة", "Shared"),
              description: t("اختر 'حفظ في الصور' لتنزيل الصورة.", "Choose 'Save to Photos' to download."),
            });
            playSound("success");
            return;
          } catch (shareError) {
            if ((shareError as Error).name === 'AbortError') {
              return;
            }
          }
        }
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      
      playSound("success");
      toast({
        title: t("تم التحميل", "Download Complete"),
        description: t("تم حفظ الصورة بنجاح.", "Image saved successfully."),
      });
    } catch (error) {
      console.error("Image Download Error:", error);
      playSound("error");
      toast({
        title: t("فشل التحميل", "Download Failed"),
        description: t("تعذر حفظ الصورة.", "Could not save image."),
        variant: "destructive",
      });
    }
  };

  const handleShare = async (platform: "whatsapp" | "telegram") => {
    if (!posterRef.current) return;

    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });

      const text = posterContent 
        ? `${posterContent.title}\n\n#صحتك_تهمنا #وعي_صحي\nدائرة صحة كركوك`
        : "بوستر توعية صحية";

      if (navigator.share && navigator.canShare({ files: [new File([blob], "poster.png", { type: "image/png" })] })) {
        await navigator.share({
          title: posterContent?.title || "بوستر صحي",
          text: text,
          files: [new File([blob], "poster.png", { type: "image/png" })]
        });
      } else {
        const url = platform === "whatsapp" 
          ? `https://wa.me/?text=${encodeURIComponent(text)}`
          : `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
      }

      toast({
        title: "تم فتح المشاركة",
        description: `يمكنك الآن مشاركة البوستر عبر ${platform === "whatsapp" ? "واتساب" : "تيليجرام"}`,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({ title: "تم تسجيل الخروج" });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-amber-50/30 flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600 font-medium">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-amber-50/30 font-sans" dir={dir}>
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 p-0.5 shadow-lg shadow-teal-500/20">
                  <div className="w-full h-full bg-white rounded-lg sm:rounded-xl flex items-center justify-center p-1">
                    <img src={logoUrl} alt={t("شعار دائرة صحة كركوك", "Kirkuk Health Department Logo")} className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="hidden sm:block w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm p-1">
                  <img src={ministryLogoUrl} alt={t("شعار وزارة الصحة", "Ministry of Health Logo")} className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="hidden xs:block">
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-teal-600 to-amber-600 bg-clip-text text-transparent font-display">
                  {t("منصة التوعية الصحية", "Health Awareness Platform")}
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-500">{t("دائرة صحة كركوك - قطاع كركوك الأول", "Kirkuk Health Dept. - Sector 1")}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
              <LanguageToggle />
              {user ? (
                <>
                  <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-sm text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-amber-500 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  {isAdmin && (
                    <Button 
                      variant="default" 
                      size="icon"
                      onClick={() => setLocation("/dashboard")}
                      className="sm:hidden bg-gradient-to-r from-teal-500 to-teal-600"
                      data-testid="button-dashboard-mobile"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}
                  {isAdmin && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => setLocation("/dashboard")}
                      className="hidden sm:flex bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md shadow-teal-500/20"
                      data-testid="button-dashboard"
                    >
                      <Settings className="w-4 h-4 ml-1" />
                      <span className="hidden md:inline">لوحة التحكم</span>
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setLocation("/archive")}
                    className="sm:hidden border-slate-200"
                    data-testid="button-archive-mobile"
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation("/archive")}
                    className="hidden sm:flex border-slate-200"
                    data-testid="button-archive"
                  >
                    <Archive className="w-4 h-4 ml-1" />
                    <span className="hidden md:inline">الأرشيف</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleLogout}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation("/login")}
                    data-testid="button-login"
                    className="text-xs sm:text-sm"
                  >
                    <span className="hidden xs:inline">تسجيل الدخول</span>
                    <span className="xs:hidden">دخول</span>
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setLocation("/register")}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md shadow-teal-500/20 text-xs sm:text-sm"
                    data-testid="button-register"
                  >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    <span className="hidden xs:inline">إنشاء حساب</span>
                    <span className="xs:hidden">حساب</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-28 space-y-6">
              <GeneratorForm 
                onGenerate={handleGenerate}
                onOrientationChange={setOrientation}
                onDownload={handleDownload}
                onDownloadImage={handleDownloadImage}
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
                selectedTheme={selectedTheme}
                onThemeChange={setSelectedTheme}
                colorThemes={colorThemes}
                language={language}
              />

              {posterContent && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-5 shadow-lg shadow-slate-200/30">
                  <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-teal-500" />
                    مشاركة البوستر
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleShare("whatsapp")}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all"
                      data-testid="button-share-whatsapp"
                    >
                      <SiWhatsapp className="w-5 h-5" />
                      واتساب
                    </button>
                    <button
                      onClick={() => handleShare("telegram")}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
                      data-testid="button-share-telegram"
                    >
                      <SiTelegram className="w-5 h-5" />
                      تيليجرام
                    </button>
                  </div>
                </div>
              )}
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">تنبيه رسمي</h4>
                    <p className="text-sm text-amber-800/80 leading-relaxed">
                      هذه الرسالة أُعدّت وفق توجيهات وزارة الصحة العراقية. جميع النصوص معتمدة رسمياً.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <DailyHealthTip />
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-200/50 shadow-xl shadow-slate-200/40 p-1 sm:p-2">
              <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl sm:rounded-2xl p-2 sm:p-6 md:p-10 flex items-center justify-center min-h-[350px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[800px] overflow-hidden relative">
                
                <div className="absolute inset-0 opacity-[0.02]" 
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
                  theme={selectedTheme}
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-sm text-slate-500 px-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                <span>{t("معاينة حية", "Live Preview")} - A4 {orientation === 'portrait' ? t('عمودي', 'Portrait') : t('أفقي', 'Landscape')}</span>
              </div>
              <p className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-md">210 × 297 {t("مم", "mm")}</p>
            </div>
          </div>
          
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span>برمجة وتصميم:</span>
              <span className="font-semibold text-slate-700">م. صيدلي علاء صالح أحمد</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-teal-600 font-medium">#صحتك_تهمنا</span>
              <span className="text-amber-600 font-medium">#وعي_صحي</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
