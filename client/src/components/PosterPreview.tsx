import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Building2, Sparkles } from "lucide-react";
import logoUrl from "@/assets/logo.png";
import ministryLogoUrl from "@/assets/ministry-logo.png";

interface PosterPreviewProps {
  orientation: "portrait" | "landscape";
  centerName: string;
  generatedContent: { title: string; points: string[]; slug?: string } | null;
  isLoading: boolean;
  generatedImage?: string | null;
}

export const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(
  ({ orientation, centerName, generatedContent, isLoading, generatedImage }, ref) => {
    const isPortrait = orientation === "portrait";
    
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
            ${isPortrait ? "w-[210mm] h-[297mm]" : "w-[297mm] h-[210mm]"}
            origin-top transform scale-[0.35] sm:scale-[0.45] md:scale-[0.55] lg:scale-[0.65]
            flex flex-col text-slate-800
          `}
          style={{
            aspectRatio: isPortrait ? "210/297" : "297/210",
          }}
        >
          <div 
            className="absolute top-0 left-0 w-full h-40"
            style={{ 
              background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #f59e0b 100%)",
              clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)"
            }}
          />
          
          <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10 5" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="1" strokeDasharray="5 3" />
            </svg>
          </div>
          
          <header className="relative z-10 px-10 py-6 flex justify-between items-start">
            <div className="flex flex-col gap-1 text-white drop-shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full p-1.5 flex items-center justify-center shadow-lg">
                  <img src={ministryLogoUrl} alt="شعار وزارة الصحة" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">وزارة الصحة العراقية</h2>
                  <h3 className="text-lg font-semibold opacity-95">دائرة صحة كركوك</h3>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center p-2 border-4 border-amber-400">
                <img src={logoUrl} alt="شعار دائرة صحة كركوك" className="w-full h-full object-contain" />
              </div>
            </div>
          </header>

          <main className="relative z-10 flex-1 px-12 py-6 flex flex-col">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full w-full animate-pulse gap-4">
                <div className="h-16 w-3/4 bg-slate-200 rounded-lg"></div>
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                <div className="h-4 w-4/6 bg-slate-200 rounded"></div>
              </div>
            ) : generatedContent ? (
              <>
                <div className="text-center mb-8">
                  <h1 
                    className="text-5xl font-extrabold leading-tight mb-4 font-display"
                    style={{ 
                      background: "linear-gradient(135deg, #0d9488, #14b8a6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}
                  >
                    {generatedContent.title}
                  </h1>
                  <div 
                    className="h-1.5 w-40 rounded-full mx-auto"
                    style={{ background: "linear-gradient(90deg, #0d9488, #f59e0b)" }}
                  />
                </div>

                {generatedImage && (
                  <div className="w-full flex justify-center mb-6">
                    <div 
                      className="rounded-2xl overflow-hidden shadow-xl"
                      style={{ border: "4px solid #14b8a6" }}
                    >
                      <img 
                        src={generatedImage} 
                        alt="صورة توضيحية" 
                        className="max-h-[200px] w-auto object-contain"
                        data-testid="poster-generated-image"
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 space-y-4">
                  {generatedContent.points.map((point, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl"
                      style={{ 
                        backgroundColor: idx % 2 === 0 ? "#f0fdfa" : "#fffbeb",
                        borderRight: `4px solid ${idx % 2 === 0 ? "#14b8a6" : "#f59e0b"}`
                      }}
                      data-testid={`poster-point-${idx}`}
                    >
                      <span 
                        className="flex-shrink-0 w-12 h-12 rounded-full text-white flex items-center justify-center text-xl font-bold shadow-lg"
                        style={{ 
                          background: idx % 2 === 0 
                            ? "linear-gradient(135deg, #0d9488, #14b8a6)" 
                            : "linear-gradient(135deg, #d97706, #f59e0b)"
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-xl font-medium leading-relaxed text-slate-700 pt-2">
                        {point}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <div 
                    className="flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold text-xl shadow-xl"
                    style={{ background: "linear-gradient(135deg, #0d9488, #14b8a6, #f59e0b)" }}
                  >
                    <Sparkles className="w-6 h-6" />
                    <span>صحتك أمانة.. حافظ عليها</span>
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                <Building2 className="w-32 h-32 mb-4 text-slate-200" />
                <p className="text-2xl font-bold">معاينة البوستر ستظهر هنا</p>
                <p className="text-lg mt-2">اختر موضوعاً معتمداً لعرض المحتوى</p>
              </div>
            )}
          </main>

          <footer 
            className="relative z-10 px-10 py-5 mt-auto"
            style={{ backgroundColor: "#f0fdfa" }}
          >
            <div className="flex justify-between items-center text-sm">
              <div className="flex flex-col" style={{ color: "#0d9488" }}>
                <span className="font-bold text-lg">{centerName || "المركز الصحي"}</span>
                <span className="text-sm opacity-80">قطاع كركوك الأول - وحدة تعزيز الصحة</span>
              </div>
              <div className="flex flex-col items-end" style={{ color: "#0d9488" }}>
                <span className="font-semibold">برمجة وتصميم: م. صيدلي علاء صالح أحمد</span>
                <div className="flex gap-4 text-sm mt-1" style={{ color: "#f59e0b" }}>
                  <span>#صحتك_تهمنا</span>
                  <span>#وعي_صحي</span>
                </div>
              </div>
            </div>
            <div 
              className="h-3 w-full absolute bottom-0 left-0"
              style={{ background: "linear-gradient(90deg, #0d9488, #14b8a6, #f59e0b, #14b8a6, #0d9488)" }}
            />
          </footer>
        </motion.div>
      </div>
    );
  }
);

PosterPreview.displayName = "PosterPreview";
