import { Lightbulb, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const healthTips = [
  { tip: "اشرب 8 أكواب من الماء يومياً للحفاظ على صحتك", tipEn: "Drink 8 glasses of water daily for good health" },
  { tip: "امشِ 30 دقيقة يومياً لتنشيط الدورة الدموية", tipEn: "Walk 30 minutes daily to improve circulation" },
  { tip: "تناول الخضروات والفواكه الطازجة يومياً", tipEn: "Eat fresh vegetables and fruits daily" },
  { tip: "النوم 7-8 ساعات ضروري لصحة الجسم والعقل", tipEn: "Sleep 7-8 hours for body and mind health" },
  { tip: "اغسل يديك بالماء والصابون لمدة 20 ثانية", tipEn: "Wash hands with soap for 20 seconds" },
  { tip: "قلل من تناول السكر والملح في طعامك", tipEn: "Reduce sugar and salt in your food" },
  { tip: "مارس تمارين التنفس للتخفيف من التوتر", tipEn: "Practice breathing exercises to reduce stress" },
  { tip: "راجع طبيبك بشكل دوري للفحص الشامل", tipEn: "Visit your doctor regularly for checkups" },
  { tip: "تجنب التدخين والمشروبات الغازية", tipEn: "Avoid smoking and carbonated drinks" },
  { tip: "حافظ على وزن صحي من خلال الغذاء المتوازن", tipEn: "Maintain healthy weight with balanced diet" },
  { tip: "اعتنِ بصحة أسنانك بالتنظيف المنتظم", tipEn: "Take care of dental health with regular cleaning" },
  { tip: "تجنب الجلوس لفترات طويلة وتحرك كل ساعة", tipEn: "Avoid sitting for long periods, move every hour" },
  { tip: "احمِ بشرتك من أشعة الشمس القوية", tipEn: "Protect your skin from strong sunlight" },
  { tip: "تناول وجبة الإفطار لتنشيط جسمك صباحاً", tipEn: "Eat breakfast to energize your body" },
  { tip: "قلل من استخدام الأجهزة الإلكترونية قبل النوم", tipEn: "Reduce screen time before sleep" },
  { tip: "حافظ على تهوية جيدة في منزلك", tipEn: "Maintain good ventilation in your home" },
  { tip: "اللقاحات تحميك وتحمي عائلتك من الأمراض", tipEn: "Vaccines protect you and your family" },
  { tip: "الضحك والسعادة يقويان جهاز المناعة", tipEn: "Laughter and happiness boost immunity" },
  { tip: "تناول المكسرات لصحة القلب والدماغ", tipEn: "Eat nuts for heart and brain health" },
  { tip: "اهتم بصحتك النفسية كما تهتم بصحتك الجسدية", tipEn: "Care for mental health as you do physical" },
  { tip: "التمارين الرياضية تحسن المزاج وتقلل القلق", tipEn: "Exercise improves mood and reduces anxiety" },
  { tip: "اقرأ الملصقات الغذائية قبل شراء المنتجات", tipEn: "Read food labels before buying products" },
  { tip: "حافظ على نظافة بيئتك لصحة أفضل", tipEn: "Keep your environment clean for better health" },
  { tip: "الصوم المتقطع قد يحسن صحة الجسم", tipEn: "Intermittent fasting may improve body health" },
  { tip: "تناول الأسماك مرتين أسبوعياً لصحة القلب", tipEn: "Eat fish twice weekly for heart health" },
  { tip: "قلل من القهوة واستبدلها بالشاي الأخضر", tipEn: "Reduce coffee, replace with green tea" },
  { tip: "الحركة في الهواء الطلق تنعش الجسم والعقل", tipEn: "Outdoor activity refreshes body and mind" },
  { tip: "اعتنِ بصحة عينيك واستريحهما من الشاشات", tipEn: "Care for eye health, rest from screens" },
  { tip: "الصلاة والتأمل يخففان من ضغوط الحياة", tipEn: "Prayer and meditation reduce life stress" },
  { tip: "شارك وقتك مع العائلة لصحة نفسية أفضل", tipEn: "Share time with family for better mental health" },
  { tip: "اختر الأطعمة الكاملة بدلاً من المصنعة", tipEn: "Choose whole foods over processed ones" },
];

function getDailyTip() {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return healthTips[dayOfYear % healthTips.length];
}

interface DailyHealthTipProps {
  language?: "ar" | "en";
}

export function DailyHealthTip({ language = "ar" }: DailyHealthTipProps) {
  const dailyTip = getDailyTip();
  const today = new Date().toLocaleDateString(language === "ar" ? "ar-IQ" : "en-US", { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-r from-amber-50 to-teal-50 border-amber-200/50 shadow-lg overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-bold text-amber-800">
                  {language === "ar" ? "نصيحة اليوم الصحية" : "Daily Health Tip"}
                </h3>
                <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                  {today}
                </span>
              </div>
              <p className="text-slate-700 text-lg font-medium leading-relaxed" dir={language === "ar" ? "rtl" : "ltr"}>
                {language === "ar" ? dailyTip.tip : dailyTip.tipEn}
              </p>
            </div>
            <RefreshCw className="w-4 h-4 text-amber-400 opacity-50 flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
