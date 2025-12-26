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
  isPrintMode?: boolean;
  template?: "modern" | "classic" | "minimal";
  qrCodeData?: string | null;
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
  ({ orientation, centerName, generatedContent, isLoading, generatedImage, theme = defaultTheme, isPrintMode = false, template = "modern", qrCodeData }, ref) => {
    const isPortrait = orientation === "portrait";
    
    const posterWidthPx = isPortrait ? 794 : 1122;
    const posterHeightPx = isPortrait ? 1122 : 794;
    const scale = isPrintMode ? 1 : 0.32;

    const renderModernHeader = () => (
      <>
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
      </>
    );

    const renderClassicHeader = () => (
      <header className="relative z-10 px-10 py-8" style={{ background: theme.primary }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-white">
            <div className="w-20 h-20 bg-white rounded-lg p-2 flex items-center justify-center">
              <img src={ministryLogoUrl} alt="شعار وزارة الصحة" className="w-full h-full object-contain" crossOrigin="anonymous" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">وزارة الصحة العراقية</h2>
              <h3 className="text-lg font-semibold opacity-90">دائرة صحة كركوك</h3>
            </div>
          </div>
          <div className="w-20 h-20 bg-white rounded-lg p-2 flex items-center justify-center">
            <img src={logoUrl} alt="شعار دائرة صحة كركوك" className="w-full h-full object-contain" crossOrigin="anonymous" />
          </div>
        </div>
        <div className="mt-4 h-1 w-full" style={{ background: theme.secondary }} />
      </header>
    );

    const renderMinimalHeader = () => (
      <header className="relative z-10 px-10 py-6 flex justify-between items-center" style={{ borderBottom: `3px solid ${theme.primary}` }}>
        <div className="flex items-center gap-3">
          <img src={ministryLogoUrl} alt="شعار وزارة الصحة" className="w-14 h-14 object-contain" crossOrigin="anonymous" />
          <div>
            <h2 className="text-lg font-bold" style={{ color: theme.primary }}>وزارة الصحة العراقية</h2>
            <h3 className="text-sm" style={{ color: theme.secondary }}>دائرة صحة كركوك</h3>
          </div>
        </div>
        <img src={logoUrl} alt="شعار دائرة صحة كركوك" className="w-16 h-16 object-contain" crossOrigin="anonymous" />
      </header>
    );

    const renderHeader = () => {
      if (template === "minimal") return renderMinimalHeader();
      if (template === "classic") return renderClassicHeader();
      return renderModernHeader();
    };

    const renderPoints = () => {
      if (!generatedContent) return null;
      
      if (template === "minimal") {
        return (
          <div className="space-y-3 flex-1">
            {generatedContent.points.map((point, index) => (
              <div key={index} className="flex items-start gap-4 py-2" style={{ borderRight: `3px solid ${theme.primary}`, paddingRight: '16px' }}>
                <span className="text-lg font-medium leading-relaxed text-slate-700">{point}</span>
              </div>
            ))}
          </div>
        );
      }
      
      if (template === "classic") {
        return (
          <div className="space-y-3 flex-1">
            {generatedContent.points.map((point, index) => (
              <div key={index} className="flex items-start gap-4 p-3" style={{ background: `${theme.bg}50`, border: `1px solid ${theme.primary}20` }}>
                <div 
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: theme.primary }}
                >
                  {index + 1}
                </div>
                <span className="text-lg font-medium leading-relaxed text-slate-700 pt-1">{point}</span>
              </div>
            ))}
          </div>
        );
      }
      
      return (
        <div className="space-y-4 flex-1">
          {generatedContent.points.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-5 p-4 rounded-2xl"
              style={{ backgroundColor: `${theme.bg}80` }}
            >
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
              >
                {index + 1}
              </div>
              <span className="text-xl font-medium leading-relaxed text-slate-700 pt-2">{point}</span>
            </div>
          ))}
        </div>
      );
    };

    const renderSlogan = () => {
      if (template === "minimal") {
        return (
          <div className="mt-6 text-center">
            <span className="text-lg font-bold" style={{ color: theme.primary }}>صحتك أمانة.. حافظ عليها</span>
          </div>
        );
      }
      
      if (template === "classic") {
        return (
          <div className="mt-6 py-3 text-center" style={{ background: theme.primary }}>
            <span className="text-xl font-bold text-white">صحتك أمانة.. حافظ عليها</span>
          </div>
        );
      }
      
      return (
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
      );
    };

    const PosterContent = () => (
      <>
        {renderHeader()}

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
                  className={`font-extrabold leading-tight mb-4 font-display ${template === "minimal" ? "text-4xl" : "text-5xl"}`}
                  style={{ 
                    backgroundImage: template === "minimal" ? "none" : `linear-gradient(135deg, ${theme.primary}, ${theme.primary}cc)`,
                    backgroundClip: template === "minimal" ? "unset" : "text",
                    WebkitBackgroundClip: template === "minimal" ? "unset" : "text",
                    WebkitTextFillColor: template === "minimal" ? theme.primary : "transparent",
                    color: template === "minimal" ? theme.primary : "transparent"
                  }}
                >
                  {generatedContent.title}
                </h1>
                {template !== "minimal" && (
                  <div 
                    className="h-2 w-48 rounded-full mx-auto"
                    style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
                  />
                )}
              </div>

              {generatedImage && (
                <div className="flex justify-center mb-8">
                  <div 
                    className={`overflow-hidden shadow-xl ${template === "minimal" ? "w-40 h-40 rounded-lg" : template === "classic" ? "w-44 h-44 rounded-lg" : "w-48 h-48 rounded-2xl"}`}
                    style={{ border: template === "minimal" ? `2px solid ${theme.primary}` : `4px solid ${theme.secondary}` }}
                  >
                    <img 
                      src={generatedImage} 
                      alt="صورة توضيحية" 
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
              )}

              {renderPoints()}
              {renderSlogan()}
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
            
            {qrCodeData && (
              <div className="flex flex-col items-center">
                <img 
                  src={qrCodeData} 
                  alt="رمز QR" 
                  className="w-20 h-20 rounded-lg shadow-lg"
                  style={{ border: `2px solid ${theme.primary}` }}
                  crossOrigin="anonymous"
                />
                <span className="text-xs mt-1 opacity-70" style={{ color: theme.primary }}>امسح للمزيد</span>
              </div>
            )}
            
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
      </>
    );

    if (isPrintMode) {
      return (
        <div
          ref={ref}
          className="bg-white overflow-hidden flex flex-col text-slate-800 relative"
          style={{
            width: posterWidthPx,
            height: posterHeightPx,
          }}
        >
          <PosterContent />
        </div>
      );
    }
    
    return (
      <div 
        className="flex items-center justify-center p-4 bg-slate-100/50 rounded-xl w-full overflow-auto"
        style={{ minHeight: '400px' }}
      >
        <div 
          style={{
            width: posterWidthPx * scale,
            height: posterHeightPx * scale,
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <motion.div
            ref={ref}
            id="poster-preview"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-2xl overflow-hidden flex flex-col text-slate-800 relative"
            style={{
              width: posterWidthPx,
              height: posterHeightPx,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <PosterContent />
          </motion.div>
        </div>
      </div>
    );
  }
);

PosterPreview.displayName = "PosterPreview";
