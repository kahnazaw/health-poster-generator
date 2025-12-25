import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Building2, Sparkles } from "lucide-react";
import logoUrl from "@/assets/logo.png";
import ministryLogoUrl from "@/assets/ministry-logo.png";
import type { ColorTheme } from "@/pages/Home";

interface PosterPreviewProps {
  orientation: "portrait" | "landscape";
  centerName: string;
  generatedContent: { title: string; points: string[]; slug?: string } | null;
  isLoading: boolean;
  generatedImage?: string | null;
  theme?: ColorTheme;
}

const defaultTheme: ColorTheme = {
  id: "teal-gold",
  name: "تركوازي ذهبي",
  primary: "#0d9488",
  secondary: "#f59e0b",
  gradient: "from-teal-500 to-amber-500",
  bg: "#f0fdfa"
};

export const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(
  ({ orientation, centerName, generatedContent, isLoading, generatedImage, theme = defaultTheme }, ref) => {
    const isPortrait = orientation === "portrait";
    
    // Scale factor for preview
    const scale = 0.35;
    const posterWidthMM = isPortrait ? 210 : 297;
    const posterHeightMM = isPortrait ? 297 : 210;
    
    return (
      <div 
        className="flex items-center justify-center p-4 bg-slate-100/50 rounded-xl w-full"
        style={{ minHeight: '450px' }}
      >
        <div 
          className="relative"
          style={{
            width: posterWidthMM * scale + 'mm',
            height: posterHeightMM * scale + 'mm',
          }}
        >
          <motion.div
            ref={ref}
            id="poster-preview"
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 bg-white shadow-2xl overflow-hidden flex flex-col text-slate-800 origin-top-left"
            style={{
              width: posterWidthMM + 'mm',
              height: posterHeightMM + 'mm',
              transform: `scale(${scale})`,
            }}
          >
            <div 
              className="absolute top-0 left-0 w-full h-44"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primary}dd 50%, ${theme.secondary} 100%)`,
                clipPath: "polygon(0 0, 100% 0, 100% 65%, 0 100%)"
              }}
            />
            
            <div className="absolute top-0 right-0 w-72 h-72 opacity-15">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="8 6" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="100" cy="100" r="50" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 3" />
              </svg>
            </div>

            <div 
              className="absolute bottom-0 left-0 w-64 h-64 opacity-5"
              style={{ 
                background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)`
              }}
            />
            
            <header className="relative z-10 px-10 py-8 flex justify-between items-start">
              <div className="flex flex-col gap-1 text-white drop-shadow-lg">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-20 h-20 bg-white rounded-2xl p-2 flex items-center justify-center shadow-xl"
                    style={{ border: `4px solid ${theme.secondary}` }}
                  >
                    <img src={ministryLogoUrl} alt="شعار وزارة الصحة" className="w-full h-full object-contain" crossOrigin="anonymous" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold drop-shadow-md">وزارة الصحة العراقية</h2>
                    <h3 className="text-lg font-semibold opacity-95">دائرة صحة كركوك</h3>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div 
                  className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center p-2"
                  style={{ border: `4px solid ${theme.secondary}` }}
                >
                  <img src={logoUrl} alt="شعار دائرة صحة كركوك" className="w-full h-full object-contain" crossOrigin="anonymous" />
                </div>
              </div>
            </header>

            <main className="relative z-10 flex-1 px-12 py-6 flex flex-col">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full w-full animate-pulse gap-4">
                  <div className="h-16 w-3/4 bg-slate-200 rounded-xl"></div>
                  <div className="h-4 w-full bg-slate-200 rounded-lg"></div>
                  <div className="h-4 w-5/6 bg-slate-200 rounded-lg"></div>
                  <div className="h-4 w-4/6 bg-slate-200 rounded-lg"></div>
                </div>
              ) : generatedContent ? (
                <>
                  <div className="text-center mb-8">
                    <h1 
                      className="text-5xl font-extrabold leading-tight mb-4 font-display"
                      style={{ 
                        backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}cc)`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent"
                      }}
                    >
                      {generatedContent.title}
                    </h1>
                    <div 
                      className="h-2 w-48 rounded-full mx-auto"
                      style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
                    />
                  </div>

                  {generatedImage && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-center mb-8"
                    >
                      <div 
                        className="w-48 h-48 rounded-2xl overflow-hidden shadow-xl"
                        style={{ border: `4px solid ${theme.secondary}` }}
                      >
                        <img 
                          src={generatedImage} 
                          alt="صورة توضيحية" 
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-4 flex-1">
                    {generatedContent.points.map((point, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-5 p-4 rounded-2xl"
                        style={{ backgroundColor: `${theme.bg}80` }}
                      >
                        <div 
                          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                        >
                          {index + 1}
                        </div>
                        <span className="text-xl font-medium leading-relaxed text-slate-700 pt-2">
                          {point}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-center">
                    <div 
                      className="flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold text-xl shadow-2xl"
                      style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}dd, ${theme.secondary})` }}
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
              className="relative z-10 px-10 py-6 mt-auto"
              style={{ backgroundColor: theme.bg }}
            >
              <div className="flex justify-between items-center text-sm">
                <div className="flex flex-col" style={{ color: theme.primary }}>
                  <span className="font-bold text-lg">{centerName || "المركز الصحي"}</span>
                  <span className="text-sm opacity-80">قطاع كركوك الأول - وحدة تعزيز الصحة</span>
                </div>
                <div className="flex flex-col items-end" style={{ color: theme.primary }}>
                  <span className="font-semibold">برمجة وتصميم: م. صيدلي علاء صالح أحمد</span>
                  <div className="flex gap-4 text-sm mt-1" style={{ color: theme.secondary }}>
                    <span>#صحتك_تهمنا</span>
                    <span>#وعي_صحي</span>
                  </div>
                </div>
              </div>
              <div 
                className="h-3 w-full absolute bottom-0 left-0"
                style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.primary})` }}
              />
            </footer>
          </motion.div>
        </div>
      </div>
    );
  }
);

PosterPreview.displayName = "PosterPreview";
