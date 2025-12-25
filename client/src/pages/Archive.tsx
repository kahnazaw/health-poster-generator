import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Calendar, Building2 } from "lucide-react";
import { useSound } from "@/hooks/use-sound";
import logoUrl from "@/assets/logo.png";

interface ArchivedPoster {
  id: number;
  userId: number;
  topicId: number;
  centerName: string;
  orientation: string;
  createdAt: string;
  topic: {
    id: number;
    slug: string;
    title: string;
    points: string[];
  };
}

export default function Archive() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { playSound } = useSound();

  const { data: posters, isLoading } = useQuery<ArchivedPoster[]>({
    queryKey: ["/api/posters/archive"],
    enabled: !!user,
  });

  if (!user) {
    setLocation("/login");
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
                <h1 className="text-lg font-bold text-slate-900">الأرشيف الخاص</h1>
                <p className="text-xs text-slate-500">البوسترات المُنشأة سابقاً</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => { playSound("click"); setLocation("/"); }}
              data-testid="button-back-home"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posters && posters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posters.map((poster) => (
              <Card key={poster.id} className="hover-elevate cursor-pointer" data-testid={`card-poster-${poster.id}`}>
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      {poster.topic.title}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary">
                    {poster.orientation === "portrait" ? "عمودي" : "أفقي"}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>{poster.centerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(poster.createdAt).toLocaleDateString("ar-IQ")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">لا توجد بوسترات محفوظة</h3>
              <p className="text-muted-foreground mb-6">قم بإنشاء أول بوستر توعوي الآن</p>
              <Button onClick={() => setLocation("/")} data-testid="button-create-first">
                إنشاء بوستر جديد
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
