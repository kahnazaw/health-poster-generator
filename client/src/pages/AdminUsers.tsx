import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, User, Shield, Trash2, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import logoUrl from "@/assets/logo.png";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface PendingUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminUsers() {
  const { user, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: users, isLoading: usersLoading } = useQuery<UserData[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAdmin,
  });

  const { data: pendingUsers } = useQuery<PendingUser[]>({
    queryKey: ["/api/admin/pending-users"],
    enabled: isAdmin,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${id}/status`, { status });
      if (!res.ok) throw new Error("فشل تحديث الحالة");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ 
        title: variables.status === "approved" ? "تمت الموافقة على المستخدم" : "تم رفض المستخدم" 
      });
    },
    onError: () => {
      toast({ title: "فشل تحديث الحالة", variant: "destructive" });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${id}/role`, { role });
      if (!res.ok) throw new Error("فشل تحديث الصلاحية");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "تم تحديث الصلاحية" });
    },
    onError: () => {
      toast({ title: "فشل تحديث الصلاحية", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/users/${id}`, {});
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "تم حذف المستخدم" });
    },
    onError: (error: Error) => {
      toast({ title: error.message || "فشل حذف المستخدم", variant: "destructive" });
    },
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

  const approvedUsers = users?.filter(u => u.status === "approved") || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default">مفعّل</Badge>;
      case "pending":
        return <Badge variant="secondary">قيد المراجعة</Badge>;
      case "rejected":
        return <Badge variant="destructive">مرفوض</Badge>;
      default:
        return null;
    }
  };

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
                <h1 className="text-lg font-bold text-slate-900">إدارة المستخدمين</h1>
                <p className="text-xs text-slate-500">عرض وإدارة الصلاحيات</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setLocation("/dashboard")}
              data-testid="button-back-dashboard"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              لوحة التحكم
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              طلبات الانضمام ({pendingUsers?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              المستخدمون المفعّلون ({approvedUsers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {!pendingUsers?.length ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد طلبات انضمام جديدة</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingUsers.map((u) => (
                  <Card key={u.id} data-testid={`card-pending-user-${u.id}`}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-muted-foreground" />
                        {u.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>طلب في {new Date(u.createdAt).toLocaleDateString("ar-IQ")}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => updateStatusMutation.mutate({ id: u.id, status: "approved" })}
                          disabled={updateStatusMutation.isPending}
                          data-testid={`button-approve-${u.id}`}
                        >
                          <CheckCircle className="w-4 h-4 ml-1" />
                          موافقة
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => updateStatusMutation.mutate({ id: u.id, status: "rejected" })}
                          disabled={updateStatusMutation.isPending}
                          data-testid={`button-reject-${u.id}`}
                        >
                          <XCircle className="w-4 h-4 ml-1" />
                          رفض
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved">
            {usersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-5 bg-slate-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedUsers.map((u) => (
                  <Card key={u.id} data-testid={`card-user-${u.id}`}>
                    <CardHeader className="flex flex-row items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {u.role === "admin" ? (
                            <Shield className="w-5 h-5 text-primary" />
                          ) : (
                            <User className="w-5 h-5 text-muted-foreground" />
                          )}
                          {u.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{u.email}</p>
                      </div>
                      <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                        {u.role === "admin" ? "مدير" : "مستخدم"}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>انضم في {new Date(u.createdAt).toLocaleDateString("ar-IQ")}</span>
                      </div>
                      
                      {u.id !== user.id && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateRoleMutation.mutate({ 
                              id: u.id, 
                              role: u.role === "admin" ? "user" : "admin" 
                            })}
                            disabled={updateRoleMutation.isPending}
                            data-testid={`button-toggle-role-${u.id}`}
                          >
                            {u.role === "admin" ? "إزالة الإدارة" : "ترقية لمدير"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteMutation.mutate(u.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-user-${u.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      
                      {u.id === user.id && (
                        <p className="text-xs text-muted-foreground">(أنت)</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
