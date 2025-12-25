import { forwardRef } from "react";
import { motion } from "framer-motion";
import { HeartPulse, Building2 } from "lucide-react";
import logoUrl from "@/assets/logo.png";

interface PosterPreviewProps {
  orientation: "portrait" | "landscape";
  topic: string;
  centerName: string;
  generatedContent: { title: string; points: string[] } | null;
  isLoading: boolean;
}

export const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(
  ({ orientation, topic, centerName, generatedContent, isLoading }, ref) => {
    // A4 Dimensions in mm (roughly converted to px for screen @ 96dpi approx for preview scale)
    // We use aspect-ratio utilities instead for responsiveness
    
    return (
      <div className="flex items-center justify-center p-4 bg-slate-100 rounded-xl border border-slate-200 shadow-inner overflow-auto min-h-[600px]">
        <motion.div
          ref={ref}
          id="poster-preview"
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`
            relative bg-white shadow-2xl overflow-hidden
            ${orientation === "portrait" ? "w-[210mm] h-[297mm]" : "w-[297mm] h-[210mm]"}
            origin-top transform scale-[0.45] sm:scale-[0.55] md:scale-[0.65] lg:scale-[0.75] xl:scale-[0.85] 2xl:scale-100
            flex flex-col text-slate-800
          `}
          style={{
            // Hardcoded A4 ratio backup if tailwind classes fail
            aspectRatio: orientation === "portrait" ? "210/297" : "297/210",
          }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -z-0" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/5 to-transparent rounded-tr-full -z-0" />
          
          {/* Header */}
          <header className="relative z-10 px-12 py-10 flex justify-between items-start border-b-4 border-primary/20">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <HeartPulse className="w-6 h-6" />
                وزارة الصحة
              </h2>
              <h3 className="text-lg text-slate-600 font-semibold">دائرة صحة كركوك</h3>
              <p className="text-sm text-slate-500 font-medium">قطاع كركوك الأول</p>
              <p className="text-sm text-slate-500 font-medium">وحدة تعزيز الصحة</p>
            </div>

            <div className="flex flex-col items-end text-left">
              {/* Logo */}
              <div className="w-24 h-24 bg-white border-2 border-slate-100 rounded-full shadow-sm flex items-center justify-center mb-2 overflow-hidden p-1">
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <p className="text-sm font-bold text-secondary mt-1 max-w-[200px] text-center">
                {centerName || "اسم المركز الصحي"}
              </p>
            </div>
          </header>

          {/* Main Content */}
          <main className="relative z-10 flex-1 px-16 py-12 flex flex-col items-center">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full w-full animate-pulse gap-4">
                <div className="h-12 w-3/4 bg-slate-100 rounded-lg"></div>
                <div className="h-4 w-full bg-slate-100 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                <div className="h-4 w-4/6 bg-slate-100 rounded"></div>
              </div>
            ) : generatedContent ? (
              <>
                <div className="w-full text-center mb-12">
                  <h1 className="text-5xl font-extrabold text-slate-900 leading-tight mb-4 drop-shadow-sm font-display">
                    {generatedContent.title}
                  </h1>
                  <div className="h-2 w-32 bg-secondary rounded-full mx-auto" />
                </div>

                <div className="w-full flex-1">
                  <ul className="space-y-6">
                    {generatedContent.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-4 text-2xl font-medium leading-relaxed text-slate-700">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-lg font-bold mt-1">
                          {idx + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                <Building2 className="w-32 h-32 mb-4 text-slate-200" />
                <p className="text-2xl font-bold">معاينة البوستر ستظهر هنا</p>
                <p className="text-lg mt-2">قم بملء البيانات لتوليد المحتوى</p>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="relative z-10 px-12 py-6 bg-slate-50 border-t border-slate-100 mt-auto">
            <div className="flex justify-between items-center text-slate-500 text-sm">
              <p>تم الإنشاء بواسطة منصة التوعية الصحية الذكية</p>
              <div className="flex gap-4">
                <span>#صحتك_تهمنا</span>
                <span>#وعي_صحي</span>
              </div>
            </div>
            <div className="h-2 w-full bg-gradient-to-l from-primary via-secondary to-primary absolute bottom-0 left-0" />
          </footer>
        </motion.div>
      </div>
    );
  }
);

PosterPreview.displayName = "PosterPreview";
