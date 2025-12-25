import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle } from "lucide-react";
import logoUrl from "@/assets/logo.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [healthCenter, setHealthCenter] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { playSound } = useSound();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound("click");
    
    if (password !== confirmPassword) {
      playSound("error");
      toast({ 
        title: "خطأ", 
        description: "كلمتا المرور غير متطابقتين",
        variant: "destructive" 
      });
      return;
    }
    
    if (password.length < 6) {
      playSound("error");
      toast({ 
        title: "خطأ", 
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive" 
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await apiRequest("POST", "/api/auth/register", { name, email, healthCenter, password });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "فشل التسجيل");
      }
      playSound("success");
      setIsRegistered(true);
    } catch (error: any) {
      playSound("error");
      toast({ 
        title: "فشل التسجيل", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">تم إنشاء الحساب بنجاح</h2>
            <p className="text-muted-foreground mb-6">
              حسابك قيد المراجعة. سيتم إعلامك عند موافقة المدير على طلبك.
            </p>
            <Button onClick={() => setLocation("/login")} data-testid="button-go-login">
              العودة لتسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 mb-4">
            <img src={logoUrl} alt="شعار دائرة صحة كركوك" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
          <CardDescription>منصة التوعية الصحية - قطاع كركوك الأول</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك الكامل"
                required
                data-testid="input-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@health.gov.iq"
                required
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="healthCenter">اسم المركز الصحي</Label>
              <Input
                id="healthCenter"
                type="text"
                value={healthCenter}
                onChange={(e) => setHealthCenter(e.target.value)}
                placeholder="مثال: مركز صحي الحويجة"
                required
                data-testid="input-health-center"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 أحرف على الأقل"
                required
                data-testid="input-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد إدخال كلمة المرور"
                required
                data-testid="input-confirm-password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              data-testid="button-register"
            >
              {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-primary"
              onClick={() => setLocation("/login")}
              data-testid="link-login"
            >
              تسجيل الدخول
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
