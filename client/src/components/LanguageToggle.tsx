import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 border-slate-200"
      data-testid="button-language-toggle"
    >
      <Languages className="w-4 h-4" />
      <span className="font-medium">
        {language === "ar" ? "EN" : "عربي"}
      </span>
    </Button>
  );
}
