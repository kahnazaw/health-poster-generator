import { useQuery } from "@tanstack/react-query";
import { Loader2, Download, LayoutTemplate, FileText, UserCircle, Sparkles, Image } from "lucide-react";

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
  onGenerateImage?: () => void;
  orientation: "portrait" | "landscape";
  isGenerating: boolean;
  isGeneratingImage?: boolean;
  hasContent: boolean;
  hasImage?: boolean;
  selectedTopicId: number | null;
  onTopicChange: (topicId: number) => void;
  centerName: string;
  onCenterNameChange: (name: string) => void;
}

export function GeneratorForm({
  onGenerate,
  onOrientationChange,
  onDownload,
  onGenerateImage,
  orientation,
  isGenerating,
  isGeneratingImage,
  hasContent,
  hasImage,
  selectedTopicId,
  onTopicChange,
  centerName,
  onCenterNameChange,
}: GeneratorFormProps) {
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
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 md:p-8 space-y-8 backdrop-blur-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800 font-display">إعدادات البوستر</h2>
        <p className="text-slate-500 text-sm">اختر الموضوع المعتمد من وزارة الصحة</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="centerName" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-primary" />
            اسم المركز الصحي
          </label>
          <input
            id="centerName"
            type="text"
            value={centerName}
            onChange={(e) => onCenterNameChange(e.target.value)}
            placeholder="مثال: مركز الزهراء الصحي"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 placeholder:text-slate-400"
            required
            data-testid="input-center-name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="topic" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            الموضوع الصحي المعتمد
          </label>
          <select
            id="topic"
            value={selectedTopicId?.toString() || ""}
            onChange={(e) => onTopicChange(parseInt(e.target.value))}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800"
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

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-primary" />
            اتجاه الصفحة
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onOrientationChange("portrait")}
              className={`
                px-4 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all
                ${orientation === "portrait" 
                  ? "border-primary bg-primary/5 text-primary shadow-sm" 
                  : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-slate-200"}
              `}
              data-testid="button-portrait"
            >
              <div className="w-6 h-8 border-2 border-current rounded-sm bg-current/10" />
              <span className="font-medium text-sm">عمودي (Portrait)</span>
            </button>
            <button
              type="button"
              onClick={() => onOrientationChange("landscape")}
              className={`
                px-4 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all
                ${orientation === "landscape" 
                  ? "border-primary bg-primary/5 text-primary shadow-sm" 
                  : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-slate-200"}
              `}
              data-testid="button-landscape"
            >
              <div className="w-8 h-6 border-2 border-current rounded-sm bg-current/10" />
              <span className="font-medium text-sm">أفقي (Landscape)</span>
            </button>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <button
            type="submit"
            disabled={isGenerating || !selectedTopicId || !centerName.trim()}
            className="
              w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-primary/25
              bg-gradient-to-r from-primary to-primary/90 hover:to-primary
              hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              flex items-center justify-center gap-3 transition-all duration-200
            "
            data-testid="button-generate"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                جاري التوليد...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
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
                w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-violet-500/25
                bg-gradient-to-r from-violet-500 to-purple-500 hover:to-purple-600
                hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                flex items-center justify-center gap-3 transition-all duration-200
              "
              data-testid="button-generate-image"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  جاري توليد الصورة...
                </>
              ) : (
                <>
                  <Image className="w-6 h-6" />
                  {hasImage ? "توليد صورة جديدة" : "إضافة صورة بالذكاء الاصطناعي"}
                </>
              )}
            </button>
          )}

          {hasContent && (
            <button
              type="button"
              onClick={onDownload}
              className="
                w-full py-4 rounded-xl font-bold text-lg text-secondary-foreground shadow-lg shadow-secondary/20
                bg-secondary hover:bg-secondary/90
                hover:shadow-xl hover:shadow-secondary/25 hover:-translate-y-0.5 active:translate-y-0
                flex items-center justify-center gap-3 transition-all duration-200
              "
              data-testid="button-download"
            >
              <Download className="w-6 h-6" />
              تحميل PDF
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
