import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Image, ArrowRight, TrendingUp } from "lucide-react";
import logoUrl from "@/assets/logo.png";

interface Stats {
  users: number;
  topics: number;
  posters: number;
}

export default function Dashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/admin/stats"],
    enabled: isAdmin,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
        <div className="animate-pulse text-slate-500">جاري التحميل...</div>
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (!isAdmin) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10">
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">لوحة التحكم</h1>
                <p className="text-xs text-slate-500">إدارة النظام</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setLocation("/")}
              data-testid="button-back-home"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">مرحباً، {user.name}</h2>
          <p className="text-muted-foreground">إليك نظرة عامة على إحصائيات النظام</p>
        </div>

        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover-elevate" data-testid="card-stats-users">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  المستخدمين
                </CardTitle>
                <Users className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.users || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">مستخدم مسجل</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-stats-topics">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  المواضيع المعتمدة
                </CardTitle>
                <FileText className="w-5 h-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.topics || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">موضوع صحي</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-stats-posters">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  البوسترات المُنشأة
                </CardTitle>
                <Image className="w-5 h-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.posters || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">بوستر تم إنشاؤه</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="hover-elevate cursor-pointer" 
            onClick={() => setLocation("/admin/topics")}
            data-testid="card-manage-topics"
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">إدارة المواضيع</h3>
                  <p className="text-sm text-muted-foreground">إضافة وتعديل المواضيع المعتمدة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover-elevate cursor-pointer" 
            onClick={() => setLocation("/admin/users")}
            data-testid="card-manage-users"
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">إدارة المستخدمين</h3>
                  <p className="text-sm text-muted-foreground">عرض وإدارة صلاحيات المستخدمين</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover-elevate cursor-pointer" 
            onClick={() => setLocation("/admin/posters")}
            data-testid="card-view-posters"
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">سجل البوسترات</h3>
                  <p className="text-sm text-muted-foreground">عرض جميع البوسترات المُنشأة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
