import { 
  Heart, Stethoscope, Pill, Syringe, Activity, 
  Apple, Droplets, Sun, Moon, Brain,
  Eye, Ear, Hand, Footprints, Dumbbell,
  Baby, Users, Shield, Thermometer, Microscope,
  Leaf, Flower2, TreeDeciduous, Salad, Carrot,
  HeartPulse, Bone, Lungs, Sparkles, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

export const healthIcons = [
  { id: "heart", icon: Heart, name: "قلب", nameEn: "Heart" },
  { id: "stethoscope", icon: Stethoscope, name: "سماعة طبية", nameEn: "Stethoscope" },
  { id: "pill", icon: Pill, name: "دواء", nameEn: "Medicine" },
  { id: "syringe", icon: Syringe, name: "حقنة", nameEn: "Syringe" },
  { id: "activity", icon: Activity, name: "نبض", nameEn: "Pulse" },
  { id: "apple", icon: Apple, name: "تفاحة", nameEn: "Apple" },
  { id: "droplets", icon: Droplets, name: "قطرات", nameEn: "Droplets" },
  { id: "sun", icon: Sun, name: "شمس", nameEn: "Sun" },
  { id: "moon", icon: Moon, name: "قمر", nameEn: "Moon" },
  { id: "brain", icon: Brain, name: "دماغ", nameEn: "Brain" },
  { id: "eye", icon: Eye, name: "عين", nameEn: "Eye" },
  { id: "ear", icon: Ear, name: "أذن", nameEn: "Ear" },
  { id: "hand", icon: Hand, name: "يد", nameEn: "Hand" },
  { id: "footprints", icon: Footprints, name: "أقدام", nameEn: "Footprints" },
  { id: "dumbbell", icon: Dumbbell, name: "رياضة", nameEn: "Exercise" },
  { id: "baby", icon: Baby, name: "طفل", nameEn: "Baby" },
  { id: "users", icon: Users, name: "عائلة", nameEn: "Family" },
  { id: "shield", icon: Shield, name: "حماية", nameEn: "Protection" },
  { id: "thermometer", icon: Thermometer, name: "ميزان حرارة", nameEn: "Thermometer" },
  { id: "microscope", icon: Microscope, name: "مجهر", nameEn: "Microscope" },
  { id: "leaf", icon: Leaf, name: "ورقة", nameEn: "Leaf" },
  { id: "flower", icon: Flower2, name: "وردة", nameEn: "Flower" },
  { id: "tree", icon: TreeDeciduous, name: "شجرة", nameEn: "Tree" },
  { id: "salad", icon: Salad, name: "سلطة", nameEn: "Salad" },
  { id: "carrot", icon: Carrot, name: "جزر", nameEn: "Carrot" },
  { id: "heartpulse", icon: HeartPulse, name: "نبضات القلب", nameEn: "Heartbeat" },
  { id: "bone", icon: Bone, name: "عظم", nameEn: "Bone" },
  { id: "lungs", icon: Lungs, name: "رئتين", nameEn: "Lungs" },
  { id: "sparkles", icon: Sparkles, name: "لمعان", nameEn: "Sparkles" },
  { id: "star", icon: Star, name: "نجمة", nameEn: "Star" },
];

export type HealthIconId = typeof healthIcons[number]["id"];

interface HealthIconPickerProps {
  selectedIcon: HealthIconId | null;
  onSelectIcon: (iconId: HealthIconId) => void;
  language?: "ar" | "en";
}

export function HealthIconPicker({ selectedIcon, onSelectIcon, language = "ar" }: HealthIconPickerProps) {
  const [open, setOpen] = useState(false);
  const selectedIconData = healthIcons.find(i => i.id === selectedIcon);
  const SelectedIconComponent = selectedIconData?.icon || Heart;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          data-testid="button-icon-picker"
        >
          <SelectedIconComponent className="w-5 h-5 text-teal-600" />
          <span>
            {selectedIconData 
              ? (language === "ar" ? selectedIconData.name : selectedIconData.nameEn)
              : (language === "ar" ? "اختر أيقونة صحية" : "Choose health icon")
            }
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="grid grid-cols-6 gap-1">
          {healthIcons.map((iconData) => {
            const IconComponent = iconData.icon;
            const isSelected = selectedIcon === iconData.id;
            return (
              <button
                key={iconData.id}
                onClick={() => {
                  onSelectIcon(iconData.id);
                  setOpen(false);
                }}
                className={`
                  p-2 rounded-lg transition-all flex items-center justify-center
                  ${isSelected 
                    ? "bg-teal-100 text-teal-700 ring-2 ring-teal-500" 
                    : "hover:bg-slate-100 text-slate-600"
                  }
                `}
                title={language === "ar" ? iconData.name : iconData.nameEn}
                data-testid={`icon-option-${iconData.id}`}
              >
                <IconComponent className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function getIconComponent(iconId: HealthIconId | null) {
  if (!iconId) return null;
  const found = healthIcons.find(i => i.id === iconId);
  return found?.icon || null;
}
