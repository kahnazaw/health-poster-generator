import { db } from "./db";
import { approvedTopics, users } from "@shared/schema";
import bcrypt from "bcryptjs";

const ministryApprovedTopics = [
  {
    slug: "hand-hygiene",
    title: "نظافة اليدين",
    points: [
      "اغسل يديك بالماء والصابون لمدة 20 ثانية على الأقل",
      "استخدم المعقم الكحولي عند عدم توفر الماء والصابون",
      "اغسل يديك قبل وبعد تناول الطعام",
      "اغسل يديك بعد استخدام دورة المياه",
      "تجنب لمس الوجه قبل غسل اليدين"
    ],
    isActive: true,
  },
  {
    slug: "diabetes-awareness",
    title: "التوعية بداء السكري",
    points: [
      "راقب مستوى السكر في الدم بانتظام",
      "اتبع نظاماً غذائياً صحياً ومتوازناً",
      "مارس الرياضة بانتظام لمدة 30 دقيقة يومياً",
      "تناول الأدوية في مواعيدها المحددة",
      "راجع الطبيب بشكل دوري للفحص"
    ],
    isActive: true,
  },
  {
    slug: "blood-pressure",
    title: "ارتفاع ضغط الدم",
    points: [
      "قلل من تناول الملح في طعامك",
      "حافظ على وزن صحي ومثالي",
      "تجنب التدخين والكحول",
      "مارس التمارين الرياضية بانتظام",
      "تناول أدويتك بانتظام حسب وصفة الطبيب"
    ],
    isActive: true,
  },
  {
    slug: "vaccination",
    title: "أهمية التطعيمات",
    points: [
      "التطعيمات تحمي من الأمراض الخطيرة",
      "التزم بجدول التطعيمات الوطني",
      "التطعيمات آمنة ومجربة علمياً",
      "تطعيم الأطفال يحميهم مدى الحياة",
      "استشر الطبيب حول التطعيمات اللازمة"
    ],
    isActive: true,
  },
  {
    slug: "mental-health",
    title: "الصحة النفسية",
    points: [
      "تحدث عن مشاعرك مع من تثق بهم",
      "مارس الرياضة لتحسين المزاج",
      "احصل على قسط كافٍ من النوم",
      "خصص وقتاً للاسترخاء والراحة",
      "لا تتردد في طلب المساعدة المتخصصة"
    ],
    isActive: true,
  },
  {
    slug: "healthy-nutrition",
    title: "التغذية الصحية",
    points: [
      "تناول الخضروات والفواكه يومياً",
      "اشرب 8 أكواب من الماء على الأقل",
      "قلل من السكريات والدهون المشبعة",
      "تناول وجبات منتظمة ومتوازنة",
      "اختر الحبوب الكاملة بدلاً من المكررة"
    ],
    isActive: true,
  },
  {
    slug: "smoking-cessation",
    title: "الإقلاع عن التدخين",
    points: [
      "التدخين يسبب السرطان وأمراض القلب",
      "الإقلاع يحسن صحتك فوراً",
      "استشر الطبيب للحصول على المساعدة",
      "تجنب الأماكن التي تشجع على التدخين",
      "استبدل التدخين بنشاطات صحية"
    ],
    isActive: true,
  },
  {
    slug: "respiratory-diseases",
    title: "الأمراض التنفسية",
    points: [
      "غطِّ فمك وأنفك عند السعال والعطس",
      "تجنب الأماكن المزدحمة والمغلقة",
      "حافظ على تهوية جيدة في المنزل",
      "ارتدِ الكمامة عند الضرورة",
      "راجع الطبيب عند ظهور أعراض تنفسية"
    ],
    isActive: true,
  },
  {
    slug: "child-health",
    title: "صحة الطفل",
    points: [
      "الرضاعة الطبيعية أفضل غذاء للطفل",
      "التزم بجدول التطعيمات الدوري",
      "راقب نمو طفلك بانتظام",
      "وفر بيئة نظيفة وآمنة للطفل",
      "شجع اللعب والنشاط البدني"
    ],
    isActive: true,
  },
  {
    slug: "water-safety",
    title: "سلامة المياه",
    points: [
      "اشرب الماء النظيف والمعقم فقط",
      "احفظ المياه في أوعية نظيفة ومغلقة",
      "اغسل خزانات المياه بانتظام",
      "تجنب شرب الماء من مصادر غير موثوقة",
      "استخدم فلاتر المياه عند الحاجة"
    ],
    isActive: true,
  },
];

export async function seedTopics() {
  console.log("Seeding approved topics...");
  
  for (const topic of ministryApprovedTopics) {
    try {
      await db.insert(approvedTopics).values(topic).onConflictDoNothing();
      console.log(`Added topic: ${topic.title}`);
    } catch (error) {
      console.log(`Topic already exists: ${topic.title}`);
    }
  }
  
  // Create default admin user if not exists
  try {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      name: "مدير النظام",
      email: "admin@kirkuk.health",
      passwordHash,
      role: "admin",
      status: "approved",
    }).onConflictDoNothing();
    console.log("Admin user created: admin@kirkuk.health");
  } catch (error) {
    console.log("Admin user already exists");
  }
  
  console.log("Seeding completed!");
}
