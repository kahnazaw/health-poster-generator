import { topics } from "../data/topics";

export function generatePoster(topic: string) {
  const cleanTopic = topic.trim();

  // 1️⃣ محتوى ثابت من المكتبة
  if (topics[cleanTopic]) {
    return {
      source: "library",
      ...topics[cleanTopic]
    };
  }

  // 2️⃣ توليد ذكي (بديل مبدئي بدون AI خارجي)
  return {
    source: "generated",
    title: `التوعية بموضوع ${cleanTopic}`,
    subtitle: "رسالة توعوية صحية",
    points: [
      `التعرف على مخاطر ${cleanTopic}`,
      `اتباع الإرشادات الصحية الخاصة بـ ${cleanTopic}`,
      "مراجعة المركز الصحي عند الحاجة",
      "الالتزام بالنصائح الطبية"
    ],
    footer: "دائرة صحة كركوك – وحدة تعزيز الصحة",
    colors: {
      primary: "#334155",
      secondary: "#f8fafc"
    }
  };
}
