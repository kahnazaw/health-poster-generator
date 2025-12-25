import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useSound } from "@/hooks/use-sound";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { playSound } = useSound();

  const handleToggle = () => {
    playSound("toggle");
    toggleTheme();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      data-testid="button-theme-toggle"
      title={theme === "light" ? "الوضع الداكن" : "الوضع الفاتح"}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
