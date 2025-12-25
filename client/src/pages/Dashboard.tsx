import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Image, ArrowRight, TrendingUp, Clock, BarChart3, Activity, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import logoUrl from "@/assets/logo.png";

interface Stats {
  users: number;
  topics: number;
  posters: number;
}

interface Analytics {
  postersByTopic: { topicTitle: string; count: number }[];
  postersByCenter: { centerName: string; count: number }[];
  postersByDate: { date: string; count: number }[];
  recentActivity: { name: string; topic: string; date: string }[];
}

interface PendingUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

const COLORS = ['#0d9488', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f43f5e', '#6366f1'];

export default function Dashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/admin/stats"],
    enabled: isAdmin,
  });

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["/api/admin/analytics"],
    enabled: isAdmin,
  });

  const { data: pendingUsers } = useQuery<PendingUser[]>({
    queryKey: ["/api/admin/pending-users"],
    enabled: isAdmin,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-amber-50/30 flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600 font-medium">جاري التحميل...</span>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-amber-50/30" dir="rtl">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 p-0.5 shadow-lg shadow-teal-500/20">
                <div className="w-full h-full bg-white rounded-lg flex items-center justify-center p-1">
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-amber-600 bg-clip-text text-transparent">لوحة التحكم</h1>
                <p className="text-xs text-slate-500">إدارة النظام والتحليلات</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setLocation("/")}
              className="border-slate-200"
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
          <p className="text-slate-500">إليك نظرة عامة على إحصائيات النظام والتحليلات</p>
        </div>

        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse bg-white/60">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-slate-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/30 overflow-hidden" data-testid="card-stats-users">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  المستخدمين
                </CardTitle>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-slate-800">{stats?.users || 0}</div>
                <p className="text-sm text-slate-500 mt-1">مستخدم مسجل</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/30 overflow-hidden" data-testid="card-stats-topics">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  المواضيع المعتمدة
                </CardTitle>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-slate-800">{stats?.topics || 0}</div>
                <p className="text-sm text-slate-500 mt-1">موضوع صحي</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/30 overflow-hidden" data-testid="card-stats-posters">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  البوسترات المُنشأة
                </CardTitle>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Image className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-slate-800">{stats?.posters || 0}</div>
                <p className="text-sm text-slate-500 mt-1">بوستر تم إنشاؤه</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/30">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-500" />
                البوسترات حسب الموضوع
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.postersByTopic && analytics.postersByTopic.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.postersByTopic} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="topicTitle" width={150} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="count" fill="#0d9488" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>لا توجد بيانات بعد</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/30">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                البوسترات حسب المركز الصحي
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.postersByCenter && analytics.postersByCenter.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.postersByCenter}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="centerName"
                      label={({ centerName, percent }) => `${centerName} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {analytics.postersByCenter.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>لا توجد بيانات بعد</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/30 mb-8">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              نشاط البوسترات خلال آخر 14 يوم
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.postersByDate && analytics.postersByDate.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analytics.postersByDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#8b5cf6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>لا توجد بيانات بعد</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card 
            className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/30 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all" 
            onClick={() => setLocation("/admin/topics")}
            data-testid="card-manage-topics"
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">إدارة المواضيع</h3>
                  <p className="text-sm text-slate-500">إضافة وتعديل المواضيع المعتمدة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/30 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all relative" 
            onClick={() => setLocation("/admin/users")}
            data-testid="card-manage-users"
          >
            {pendingUsers && pendingUsers.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute top-3 left-3 shadow-lg"
                data-testid="badge-pending-count"
              >
                <Clock className="w-3 h-3 ml-1" />
                {pendingUsers.length} طلب جديد
              </Badge>
            )}
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">إدارة المستخدمين</h3>
                  <p className="text-sm text-slate-500">عرض وإدارة صلاحيات المستخدمين</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/30 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all" 
            onClick={() => setLocation("/admin/posters")}
            data-testid="card-view-posters"
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">سجل البوسترات</h3>
                  <p className="text-sm text-slate-500">عرض جميع البوسترات المُنشأة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {analytics?.recentActivity && analytics.recentActivity.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-500" />
                آخر النشاطات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.recentActivity.map((activity, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100"
                    data-testid={`activity-item-${idx}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                        {activity.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{activity.name}</p>
                        <p className="text-sm text-slate-500">{activity.topic}</p>
                      </div>
                    </div>
                    <span className="text-sm text-slate-400">{activity.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
