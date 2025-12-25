import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Building2, Heart, Shield, Droplets, Syringe, Brain, Apple, Cigarette, Wind, Baby, GlassWater, Calendar, Activity, Eye, Pill, Sun, Users, Utensils, Footprints, Cross, Leaf, Moon, Smile, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import logoUrl from "@/assets/logo.png";
import ministryLogoUrl from "@/assets/ministry-logo.png";

interface PosterPreviewProps {
  orientation: "portrait" | "landscape";
  centerName: string;
  generatedContent: { title: string; points: string[]; slug?: string } | null;
  isLoading: boolean;
  generatedImage?: string | null;
}

const topicIcons: Record<string, typeof Heart> = {
  "hand-hygiene": Droplets,
  "diabetes-awareness": Activity,
  "blood-pressure": Heart,
  "vaccination": Syringe,
  "mental-health": Brain,
  "healthy-nutrition": Apple,
  "smoking-cessation": Cigarette,
  "respiratory-diseases": Wind,
  "child-health": Baby,
  "water-safety": GlassWater,
  "world-health-day": Calendar,
  "world-diabetes-day": Activity,
  "world-heart-day": Heart,
  "world-cancer-day": Shield,
  "world-tuberculosis-day": Wind,
  "world-aids-day": Shield,
  "world-mental-health-day": Brain,
  "world-no-tobacco-day": Cigarette,
  "world-breastfeeding-week": Baby,
  "world-immunization-week": Syringe,
  "world-oral-health-day": Smile,
  "world-kidney-day": Droplets,
  "world-sight-day": Eye,
  "world-malaria-day": Shield,
  "world-hepatitis-day": Pill,
  "healthy-lifestyle": Sun,
  "elderly-health": Users,
  "womens-health": Heart,
  "adolescent-health": Users,
  "food-safety": Utensils,
  "physical-activity": Footprints,
  "first-aid": Cross,
  "environmental-health": Leaf,
  "sleep-health": Moon,
  "stress-management": Smile,
};

const topicColors: Record<string, { primary: string; secondary: string; bg: string; gradient: string }> = {
  "hand-hygiene": { primary: "#0891b2", secondary: "#06b6d4", bg: "#ecfeff", gradient: "from-cyan-500 to-teal-400" },
  "diabetes-awareness": { primary: "#7c3aed", secondary: "#8b5cf6", bg: "#f5f3ff", gradient: "from-violet-500 to-purple-400" },
  "blood-pressure": { primary: "#dc2626", secondary: "#ef4444", bg: "#fef2f2", gradient: "from-red-500 to-rose-400" },
  "vaccination": { primary: "#059669", secondary: "#10b981", bg: "#ecfdf5", gradient: "from-emerald-500 to-green-400" },
  "mental-health": { primary: "#7c3aed", secondary: "#a78bfa", bg: "#f5f3ff", gradient: "from-purple-500 to-violet-400" },
  "healthy-nutrition": { primary: "#ea580c", secondary: "#f97316", bg: "#fff7ed", gradient: "from-orange-500 to-amber-400" },
  "smoking-cessation": { primary: "#475569", secondary: "#64748b", bg: "#f8fafc", gradient: "from-slate-600 to-gray-500" },
  "respiratory-diseases": { primary: "#0284c7", secondary: "#38bdf8", bg: "#f0f9ff", gradient: "from-sky-500 to-blue-400" },
  "child-health": { primary: "#db2777", secondary: "#ec4899", bg: "#fdf2f8", gradient: "from-pink-500 to-rose-400" },
  "water-safety": { primary: "#0891b2", secondary: "#22d3ee", bg: "#ecfeff", gradient: "from-cyan-500 to-teal-400" },
  "world-health-day": { primary: "#0891b2", secondary: "#06b6d4", bg: "#ecfeff", gradient: "from-cyan-600 to-blue-500" },
  "world-diabetes-day": { primary: "#2563eb", secondary: "#3b82f6", bg: "#eff6ff", gradient: "from-blue-600 to-indigo-500" },
  "world-heart-day": { primary: "#dc2626", secondary: "#ef4444", bg: "#fef2f2", gradient: "from-red-500 to-rose-400" },
  "world-cancer-day": { primary: "#7c3aed", secondary: "#8b5cf6", bg: "#f5f3ff", gradient: "from-purple-600 to-pink-500" },
  "world-tuberculosis-day": { primary: "#0891b2", secondary: "#06b6d4", bg: "#ecfeff", gradient: "from-teal-500 to-cyan-400" },
  "world-aids-day": { primary: "#dc2626", secondary: "#ef4444", bg: "#fef2f2", gradient: "from-red-600 to-rose-500" },
  "world-mental-health-day": { primary: "#059669", secondary: "#10b981", bg: "#ecfdf5", gradient: "from-green-500 to-teal-400" },
  "world-no-tobacco-day": { primary: "#475569", secondary: "#64748b", bg: "#f8fafc", gradient: "from-slate-600 to-gray-500" },
  "world-breastfeeding-week": { primary: "#0891b2", secondary: "#06b6d4", bg: "#ecfeff", gradient: "from-sky-500 to-cyan-400" },
  "world-immunization-week": { primary: "#059669", secondary: "#10b981", bg: "#ecfdf5", gradient: "from-emerald-500 to-green-400" },
  "world-oral-health-day": { primary: "#0284c7", secondary: "#38bdf8", bg: "#f0f9ff", gradient: "from-blue-500 to-cyan-400" },
  "world-kidney-day": { primary: "#7c3aed", secondary: "#8b5cf6", bg: "#f5f3ff", gradient: "from-purple-500 to-indigo-400" },
  "world-sight-day": { primary: "#0891b2", secondary: "#06b6d4", bg: "#ecfeff", gradient: "from-cyan-500 to-blue-400" },
  "world-malaria-day": { primary: "#059669", secondary: "#10b981", bg: "#ecfdf5", gradient: "from-green-600 to-emerald-400" },
  "world-hepatitis-day": { primary: "#ca8a04", secondary: "#eab308", bg: "#fefce8", gradient: "from-yellow-500 to-amber-400" },
  "healthy-lifestyle": { primary: "#059669", secondary: "#10b981", bg: "#ecfdf5", gradient: "from-green-500 to-teal-400" },
  "elderly-health": { primary: "#7c3aed", secondary: "#8b5cf6", bg: "#f5f3ff", gradient: "from-purple-500 to-indigo-400" },
  "womens-health": { primary: "#db2777", secondary: "#ec4899", bg: "#fdf2f8", gradient: "from-pink-500 to-rose-400" },
  "adolescent-health": { primary: "#0891b2", secondary: "#06b6d4", bg: "#ecfeff", gradient: "from-cyan-500 to-blue-400" },
  "food-safety": { primary: "#059669", secondary: "#10b981", bg: "#ecfdf5", gradient: "from-green-500 to-emerald-400" },
  "physical-activity": { primary: "#ea580c", secondary: "#f97316", bg: "#fff7ed", gradient: "from-orange-500 to-yellow-400" },
  "first-aid": { primary: "#dc2626", secondary: "#ef4444", bg: "#fef2f2", gradient: "from-red-500 to-rose-400" },
  "environmental-health": { primary: "#059669", secondary: "#10b981", bg: "#ecfdf5", gradient: "from-green-600 to-teal-400" },
  "sleep-health": { primary: "#4f46e5", secondary: "#6366f1", bg: "#eef2ff", gradient: "from-indigo-500 to-purple-400" },
  "stress-management": { primary: "#0891b2", secondary: "#06b6d4", bg: "#ecfeff", gradient: "from-teal-500 to-cyan-400" },
};

const defaultColors = { primary: "#0891b2", secondary: "#06b6d4", bg: "#ecfeff", gradient: "from-primary to-secondary" };

export const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(
  ({ orientation, centerName, generatedContent, isLoading, generatedImage }, ref) => {
    const slug = generatedContent?.slug || "";
    const Icon = topicIcons[slug] || CheckCircle2;
    const colors = topicColors[slug] || defaultColors;
    
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
            background: `linear-gradient(135deg, ${colors.bg} 0%, white 50%, ${colors.bg} 100%)`,
          }}
        >
          <div 
            className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${colors.gradient}`}
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 60%, 0 100%)" }}
          />
          
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="80" fill="none" stroke={colors.primary} strokeWidth="2" strokeDasharray="10 5" />
              <circle cx="100" cy="100" r="60" fill="none" stroke={colors.secondary} strokeWidth="1" strokeDasharray="5 3" />
            </svg>
          </div>
          
          <header className="relative z-10 px-10 py-6 flex justify-between items-start">
            <div className="flex flex-col gap-1 text-white drop-shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full p-1 flex items-center justify-center">
                  <img src={ministryLogoUrl} alt="شعار وزارة الصحة" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">وزارة الصحة العراقية</h2>
                  <h3 className="text-sm font-medium opacity-90">دائرة صحة كركوك</h3>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center p-2 border-4 border-white">
                <img src={logoUrl} alt="شعار دائرة صحة كركوك" className="w-full h-full object-contain" />
              </div>
            </div>
          </header>

          <main className="relative z-10 flex-1 px-10 py-6 flex flex-col">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full w-full animate-pulse gap-4">
                <div className="h-16 w-3/4 bg-slate-200 rounded-lg"></div>
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                <div className="h-4 w-4/6 bg-slate-200 rounded"></div>
              </div>
            ) : generatedContent ? (
              <>
                <div className="text-center mb-6">
                  <div 
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h1 
                    className="text-4xl font-extrabold leading-tight mb-3 font-display"
                    style={{ color: colors.primary }}
                  >
                    {generatedContent.title}
                  </h1>
                  <div 
                    className="h-1.5 w-32 rounded-full mx-auto"
                    style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}
                  />
                </div>

                <div className={`flex-1 ${isPortrait ? "flex flex-col gap-4" : "grid grid-cols-2 gap-4"}`}>
                  {generatedImage && (
                    <div className={`${isPortrait ? "w-full flex justify-center mb-4" : "col-span-1 flex items-center justify-center"}`}>
                      <div 
                        className="rounded-2xl overflow-hidden shadow-xl border-4"
                        style={{ borderColor: colors.primary + "30" }}
                      >
                        <img 
                          src={generatedImage} 
                          alt="صورة توضيحية" 
                          className={`${isPortrait ? "max-h-[250px]" : "max-h-[300px]"} w-auto object-contain`}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className={`${generatedImage && !isPortrait ? "col-span-1" : "w-full"} space-y-3`}>
                    {generatedContent.points.map((point, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl border shadow-sm"
                        style={{ 
                          backgroundColor: colors.bg,
                          borderColor: colors.primary + "20",
                          direction: "rtl"
                        }}
                        data-testid={`poster-point-${idx}`}
                      >
                        <span 
                          className="flex-shrink-0 w-10 h-10 rounded-full text-white flex items-center justify-center text-lg font-bold shadow-md"
                          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-lg font-medium leading-relaxed text-slate-700 pt-1.5">
                          {point}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <div 
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-lg shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>صحتك أمانة.. حافظ عليها</span>
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

          <footer className="relative z-10 px-10 py-4 mt-auto" style={{ backgroundColor: colors.bg }}>
            <div className="flex justify-between items-center text-sm" style={{ color: colors.primary }}>
              <div className="flex flex-col">
                <span className="font-bold text-base">{centerName || "المركز الصحي"}</span>
                <span className="text-xs opacity-75">قطاع كركوك الأول - وحدة تعزيز الصحة</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold">برمجة وتصميم: م. صيدلي علاء صالح أحمد</span>
                <div className="flex gap-3 text-xs mt-1 opacity-75">
                  <span>#صحتك_تهمنا</span>
                  <span>#وعي_صحي</span>
                </div>
              </div>
            </div>
            <div 
              className="h-2 w-full absolute bottom-0 left-0"
              style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})` }}
            />
          </footer>
        </motion.div>
      </div>
    );
  }
);

PosterPreview.displayName = "PosterPreview";
