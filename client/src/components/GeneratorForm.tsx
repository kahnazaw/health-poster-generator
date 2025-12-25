import { useState } from "react";
import { Loader2, Wand2, Download, LayoutTemplate, FileText, UserCircle } from "lucide-react";
import { useGeneratePoster } from "@/hooks/use-poster";

interface GeneratorFormProps {
  onGenerate: (data: { topic: string; centerName: string }) => void;
  onOrientationChange: (orientation: "portrait" | "landscape") => void;
  onDownload: () => void;
  orientation: "portrait" | "landscape";
  isGenerating: boolean;
  hasContent: boolean;
}

export function GeneratorForm({
  onGenerate,
  onOrientationChange,
  onDownload,
  orientation,
  isGenerating,
  hasContent
}: GeneratorFormProps) {
  const [topic, setTopic] = useState("");
  const [centerName, setCenterName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !centerName.trim()) return;
    onGenerate({ topic, centerName });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 md:p-8 space-y-8 backdrop-blur-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800 font-display">إعدادات البوستر</h2>
        <p className="text-slate-500 text-sm">أدخل البيانات المطلوبة لتوليد المحتوى الصحي تلقائياً</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Center Name Input */}
        <div className="space-y-2">
          <label htmlFor="centerName" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-primary" />
            اسم المركز الصحي
          </label>
          <input
            id="centerName"
            type="text"
            value={centerName}
            onChange={(e) => setCenterName(e.target.value)}
            placeholder="مثال: مركز الزهراء الصحي"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 placeholder:text-slate-400"
            required
          />
        </div>

        {/* Topic Input */}
        <div className="space-y-2">
          <label htmlFor="topic" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            موضوع الرسالة الصحية
          </label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="مثال: أهمية الرضاعة الطبيعية، الوقاية من الانفلونزا..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 resize-none"
            required
          />
        </div>

        {/* Orientation Selector */}
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
            >
              <div className="w-8 h-6 border-2 border-current rounded-sm bg-current/10" />
              <span className="font-medium text-sm">أفقي (Landscape)</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <button
            type="submit"
            disabled={isGenerating}
            className="
              w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-primary/25
              bg-gradient-to-r from-primary to-primary/90 hover:to-primary
              hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              flex items-center justify-center gap-3 transition-all duration-200
            "
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                جاري التوليد...
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                توليد البوستر
              </>
            )}
          </button>

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
