import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { GeneratorForm } from "@/components/GeneratorForm";
import { PosterPreview } from "@/components/PosterPreview";
import { useGeneratePoster, type PosterContent } from "@/hooks/use-poster";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [posterContent, setPosterContent] = useState<PosterContent | null>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const generateMutation = useGeneratePoster();

  const handleGenerate = (data: { topic: string; centerName: string }) => {
    generateMutation.mutate({ ...data, orientation }, {
      onSuccess: (content) => {
        setPosterContent(content);
        toast({
          title: "تم التوليد بنجاح!",
          description: "تم إنشاء محتوى البوستر باستخدام الذكاء الاصطناعي.",
        });
      },
      onError: () => {
        toast({
          title: "خطأ في التوليد",
          description: "حدث خطأ أثناء محاولة توليد المحتوى. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
    });
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;

    try {
      toast({
        title: "جاري التحضير...",
        description: "يتم الآن تجهيز ملف PDF للتحميل.",
      });

      const element = posterRef.current;
      
      // Temporarily remove scale transform for full resolution capture
      const originalStyle = element.getAttribute("style");
      const originalClass = element.getAttribute("class");
      
      // We need to clone or handle the scaled element properly for high res PDF.
      // A common trick is to use html2canvas scale option.
      
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      // A4 dimensions in mm
      const pdf = new jsPDF({
        orientation: orientation,
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`poster-${Date.now()}.pdf`);

      toast({
        title: "تم التحميل",
        description: "تم حفظ ملف البوستر بنجاح.",
        className: "bg-green-600 text-white border-none",
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 font-display">منصة التوعية الصحية</h1>
                <p className="text-xs text-slate-500 -mt-1">دائرة صحة كركوك</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-primary transition-colors">الرئيسية</a>
              <a href="#" className="hover:text-primary transition-colors">الأرشيف</a>
              <a href="#" className="hover:text-primary transition-colors">الإعدادات</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-6">
            <GeneratorForm 
              onGenerate={handleGenerate}
              onOrientationChange={setOrientation}
              onDownload={handleDownload}
              orientation={orientation}
              isGenerating={generateMutation.isPending}
              hasContent={!!posterContent}
            />
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
              <h4 className="font-bold mb-1 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ملاحظة
              </h4>
              <p className="opacity-90">
                يتم توليد المحتوى تلقائياً باستخدام الذكاء الاصطناعي. يرجى مراجعة النصوص الطبية قبل النشر والطباعة.
              </p>
            </div>
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
              <div className="bg-slate-50 rounded-xl p-4 md:p-8 flex items-center justify-center min-h-[600px] lg:min-h-[800px] overflow-hidden relative">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" 
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                />

                <PosterPreview
                  ref={posterRef}
                  orientation={orientation}
                  topic={posterContent ? posterContent.title : ""}
                  centerName={posterContent ? "" : ""} // Corrected placeholder
                  generatedContent={posterContent}
                  isLoading={generateMutation.isPending}
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
