import { useQuery } from "@tanstack/react-query";
import { Loader2, Download, LayoutTemplate, FileText, UserCircle, Sparkles, Image, Palette, FileImage, QrCode, Layout } from "lucide-react";
import type { ColorTheme, PosterTemplate } from "@/pages/Home";

interface ApprovedTopic {
  id: number;
  slug: string;
  title: string;
  points: string[];
  isActive: boolean;
}

interface GeneratorFormProps {
  onGenerate: (data: { topicId: number; centerName: string }) => void;
  onOrientationChange: (orientation: "portrait" | "landscape") => void;
  onDownload: () => void;
  onDownloadImage?: () => void;
  onGenerateImage?: () => void;
  onGenerateQrCode?: () => void;
  orientation: "portrait" | "landscape";
  isGenerating: boolean;
  isGeneratingImage?: boolean;
  hasContent: boolean;
  hasImage?: boolean;
  showQrCode?: boolean;
  selectedTopicId: number | null;
  onTopicChange: (topicId: number) => void;
  centerName: string;
  onCenterNameChange: (name: string) => void;
  selectedTheme?: ColorTheme;
  onThemeChange?: (theme: ColorTheme) => void;
  colorThemes?: ColorTheme[];
  selectedTemplate?: PosterTemplate;
  onTemplateChange?: (template: PosterTemplate) => void;
  posterTemplates?: PosterTemplate[];
  language?: "ar" | "en";
}

export function GeneratorForm({
  onGenerate,
  onOrientationChange,
  onDownload,
  onDownloadImage,
  onGenerateImage,
  onGenerateQrCode,
  orientation,
  isGenerating,
  isGeneratingImage,
  hasContent,
  hasImage,
  showQrCode,
  selectedTopicId,
  onTopicChange,
  centerName,
  onCenterNameChange,
  selectedTheme,
  onThemeChange,
  colorThemes,
  selectedTemplate,
  onTemplateChange,
  posterTemplates,
  language = "ar",
}: GeneratorFormProps) {
  const t = (ar: string, en: string) => language === "ar" ? ar : en;
  const { data: topics, isLoading: topicsLoading } = useQuery<ApprovedTopic[]>({
    queryKey: ["/api/topics"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTopicId && centerName.trim()) {
      onGenerate({ topicId: selectedTopicId, centerName });
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 md:p-8 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-amber-600 bg-clip-text text-transparent font-display">إعدادات البوستر</h2>
        <p className="text-slate-500 text-sm">اختر الموضوع وخصص التصميم</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="centerName" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <UserCircle className="w-3.5 h-3.5 text-white" />
            </div>
            اسم المركز الصحي
          </label>
          <input
            id="centerName"
            type="text"
            value={centerName}
            onChange={(e) => onCenterNameChange(e.target.value)}
            placeholder="مثال: مركز الزهراء الصحي"
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50/80 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none text-slate-800 placeholder:text-slate-400"
            required
            data-testid="input-center-name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="topic" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            الموضوع الصحي المعتمد
          </label>
          <select
            id="topic"
            value={selectedTopicId?.toString() || ""}
            onChange={(e) => onTopicChange(parseInt(e.target.value))}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50/80 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none text-slate-800"
            required
            disabled={topicsLoading}
            data-testid="select-topic"
          >
            <option value="">{topicsLoading ? "جاري التحميل..." : "اختر موضوعاً معتمداً"}</option>
            {topics?.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>
        </div>

        {colorThemes && selectedTheme && onThemeChange && (
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Palette className="w-3.5 h-3.5 text-white" />
              </div>
              نمط الألوان
            </label>
            <div className="grid grid-cols-3 gap-2">
              {colorThemes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onThemeChange(theme)}
                  className={`
                    relative p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                    ${selectedTheme.id === theme.id 
                      ? "border-slate-800 shadow-lg scale-105" 
                      : "border-slate-100 hover:border-slate-200 hover:shadow-md"}
                  `}
                  data-testid={`button-theme-${theme.id}`}
                >
                  <div 
                    className="w-full h-6 rounded-lg shadow-inner"
                    style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                  />
                  <span className="text-xs font-medium text-slate-600 truncate w-full text-center">{theme.name}</span>
                  {selectedTheme.id === theme.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {posterTemplates && selectedTemplate && onTemplateChange && (
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Layout className="w-3.5 h-3.5 text-white" />
              </div>
              قالب التصميم
            </label>
            <div className="grid grid-cols-3 gap-2">
              {posterTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onTemplateChange(template)}
                  className={`
                    relative p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                    ${selectedTemplate.id === template.id 
                      ? "border-cyan-500 bg-cyan-50 shadow-lg" 
                      : "border-slate-100 hover:border-slate-200 hover:shadow-md"}
                  `}
                  data-testid={`button-template-${template.id}`}
                >
                  <span className="text-sm font-medium text-slate-700">{template.name}</span>
                  <span className="text-[10px] text-slate-500 text-center leading-tight">{template.description}</span>
                  {selectedTemplate.id === template.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <LayoutTemplate className="w-3.5 h-3.5 text-white" />
            </div>
            اتجاه الصفحة
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onOrientationChange("portrait")}
              className={`
                px-4 py-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all
                ${orientation === "portrait" 
                  ? "border-teal-500 bg-teal-50 text-teal-700 shadow-lg shadow-teal-500/10" 
                  : "border-slate-100 bg-slate-50/50 text-slate-500 hover:bg-slate-100 hover:border-slate-200"}
              `}
              data-testid="button-portrait"
            >
              <div className={`w-6 h-9 border-2 rounded-md ${orientation === "portrait" ? "border-teal-500 bg-teal-500/20" : "border-current bg-current/10"}`} />
              <span className="font-medium text-sm">عمودي</span>
            </button>
            <button
              type="button"
              onClick={() => onOrientationChange("landscape")}
              className={`
                px-4 py-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all
                ${orientation === "landscape" 
                  ? "border-teal-500 bg-teal-50 text-teal-700 shadow-lg shadow-teal-500/10" 
                  : "border-slate-100 bg-slate-50/50 text-slate-500 hover:bg-slate-100 hover:border-slate-200"}
              `}
              data-testid="button-landscape"
            >
              <div className={`w-9 h-6 border-2 rounded-md ${orientation === "landscape" ? "border-teal-500 bg-teal-500/20" : "border-current bg-current/10"}`} />
              <span className="font-medium text-sm">أفقي</span>
            </button>
          </div>
        </div>

        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={isGenerating || !selectedTopicId || !centerName.trim()}
            className="
              w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-teal-500/25
              bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700
              hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5 active:translate-y-0
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg
              flex items-center justify-center gap-3 transition-all duration-200
            "
            data-testid="button-generate"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري التوليد...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                توليد البوستر
              </>
            )}
          </button>

          {hasContent && onGenerateImage && (
            <button
              type="button"
              onClick={onGenerateImage}
              disabled={isGeneratingImage}
              className="
                w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-purple-500/25
                bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
                hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 active:translate-y-0
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                flex items-center justify-center gap-3 transition-all duration-200
              "
              data-testid="button-generate-image"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري توليد الصورة...
                </>
              ) : (
                <>
                  <Image className="w-5 h-5" />
                  {hasImage ? "توليد صورة جديدة" : "إضافة صورة بالذكاء الاصطناعي"}
                </>
              )}
            </button>
          )}

          {hasContent && onGenerateQrCode && (
            <button
              type="button"
              onClick={onGenerateQrCode}
              className={`
                w-full py-3 rounded-xl font-bold text-white shadow-lg
                ${showQrCode 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/25" 
                  : "bg-gradient-to-r from-slate-600 to-slate-700 shadow-slate-500/25 hover:from-slate-700 hover:to-slate-800"}
                hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
                flex items-center justify-center gap-3 transition-all duration-200
              `}
              data-testid="button-generate-qr"
            >
              <QrCode className="w-5 h-5" />
              {showQrCode ? "تم إضافة رمز QR" : "إضافة رمز QR"}
            </button>
          )}

          {hasContent && (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onDownload}
                className="
                  py-3.5 rounded-xl font-bold text-white shadow-lg shadow-amber-500/25
                  bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600
                  hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0
                  flex items-center justify-center gap-2 transition-all duration-200
                "
                data-testid="button-download-pdf"
              >
                <Download className="w-5 h-5" />
                {t("PDF", "PDF")}
              </button>
              {onDownloadImage && (
                <button
                  type="button"
                  onClick={onDownloadImage}
                  className="
                    py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25
                    bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600
                    hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0
                    flex items-center justify-center gap-2 transition-all duration-200
                  "
                  data-testid="button-download-image"
                >
                  <FileImage className="w-5 h-5" />
                  {t("صورة", "Image")}
                </button>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
