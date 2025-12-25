import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ArrowRight, Plus, Pencil, Trash2, FileText } from "lucide-react";
import logoUrl from "@/assets/logo.png";

interface Topic {
  id: number;
  slug: string;
  title: string;
  points: string[];
  isActive: boolean;
}

export default function AdminTopics() {
  const { user, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { playSound } = useSound();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [newTopic, setNewTopic] = useState({ slug: "", title: "", points: "" });

  const { data: topics, isLoading: topicsLoading } = useQuery<Topic[]>({
    queryKey: ["/api/admin/topics"],
    enabled: isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { slug: string; title: string; points: string[] }) => {
      const res = await apiRequest("POST", "/api/admin/topics", { ...data, isActive: true });
      if (!res.ok) throw new Error("فشل إنشاء الموضوع");
      return res.json();
    },
    onSuccess: () => {
      playSound("success");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/topics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/topics"] });
      setIsAddOpen(false);
      setNewTopic({ slug: "", title: "", points: "" });
      toast({ title: "تم إضافة الموضوع بنجاح" });
    },
    onError: () => {
      playSound("error");
      toast({ title: "فشل إضافة الموضوع", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Topic> }) => {
      const res = await apiRequest("PATCH", `/api/admin/topics/${id}`, data);
      if (!res.ok) throw new Error("فشل تحديث الموضوع");
      return res.json();
    },
    onSuccess: () => {
      playSound("success");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/topics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/topics"] });
      setEditingTopic(null);
      toast({ title: "تم تحديث الموضوع بنجاح" });
    },
    onError: () => {
      playSound("error");
      toast({ title: "فشل تحديث الموضوع", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/topics/${id}`, {});
      if (!res.ok) throw new Error("فشل حذف الموضوع");
    },
    onSuccess: () => {
      playSound("success");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/topics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/topics"] });
      toast({ title: "تم حذف الموضوع" });
    },
    onError: () => {
      playSound("error");
      toast({ title: "فشل حذف الموضوع", variant: "destructive" });
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

  const handleAdd = () => {
    const pointsArray = newTopic.points.split("\n").filter(p => p.trim());
    if (pointsArray.length === 0) {
      toast({ title: "يرجى إضافة نقطة واحدة على الأقل", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      slug: newTopic.slug,
      title: newTopic.title,
      points: pointsArray,
    });
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
                <h1 className="text-lg font-bold text-slate-900">إدارة المواضيع</h1>
                <p className="text-xs text-slate-500">المواضيع الصحية المعتمدة</p>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">المواضيع ({topics?.length || 0})</h2>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-topic">
                <Plus className="w-4 h-4 ml-2" />
                إضافة موضوع
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg" dir="rtl">
              <DialogHeader>
                <DialogTitle>إضافة موضوع جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>المعرّف (slug)</Label>
                  <Input
                    value={newTopic.slug}
                    onChange={(e) => setNewTopic({ ...newTopic, slug: e.target.value })}
                    placeholder="hand-hygiene"
                    data-testid="input-topic-slug"
                  />
                </div>
                <div className="space-y-2">
                  <Label>عنوان الموضوع</Label>
                  <Input
                    value={newTopic.title}
                    onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                    placeholder="نظافة اليدين"
                    data-testid="input-topic-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>النقاط (كل سطر نقطة)</Label>
                  <Textarea
                    value={newTopic.points}
                    onChange={(e) => setNewTopic({ ...newTopic, points: e.target.value })}
                    placeholder="اغسل يديك بالماء والصابون&#10;استخدم المعقم عند عدم توفر الماء"
                    rows={6}
                    data-testid="textarea-topic-points"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAdd} 
                  disabled={createMutation.isPending || !newTopic.slug || !newTopic.title}
                  data-testid="button-save-topic"
                >
                  {createMutation.isPending ? "جاري الحفظ..." : "حفظ"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {topicsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics?.map((topic) => (
              <Card key={topic.id} data-testid={`card-topic-${topic.id}`}>
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      {topic.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{topic.slug}</p>
                  </div>
                  <Badge variant={topic.isActive ? "default" : "secondary"}>
                    {topic.isActive ? "مفعّل" : "معطّل"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                    {topic.points.slice(0, 3).map((point, idx) => (
                      <li key={idx} className="truncate">• {point}</li>
                    ))}
                    {topic.points.length > 3 && (
                      <li className="text-xs">... و{topic.points.length - 3} نقاط أخرى</li>
                    )}
                  </ul>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingTopic(topic)}
                      data-testid={`button-edit-topic-${topic.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateMutation.mutate({ 
                        id: topic.id, 
                        data: { isActive: !topic.isActive } 
                      })}
                      data-testid={`button-toggle-topic-${topic.id}`}
                    >
                      {topic.isActive ? "تعطيل" : "تفعيل"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(topic.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-topic-${topic.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
