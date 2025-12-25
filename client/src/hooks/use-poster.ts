import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface GeneratePosterRequest {
  topic: string;
  centerName: string;
}

export interface PosterContent {
  title: string;
  points: string[];
}

export function useGeneratePoster() {
  return useMutation({
    mutationFn: async (data: GeneratePosterRequest): Promise<PosterContent> => {
      // In a real implementation, this would call /api/posters/generate
      // For this demo, we'll simulate the AI response based on the prompt
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response for now since backend route might not be ready
      return {
        title: `نصائح صحية حول: ${data.topic}`,
        points: [
          "احرص على شرب كميات كافية من الماء يومياً للحفاظ على رطوبة الجسم.",
          "تناول الفواكه والخضروات الطازجة لتعزيز المناعة.",
          "ممارسة الرياضة لمدة 30 دقيقة يومياً تحسن صحة القلب.",
          "النوم الجيد لمدة 7-8 ساعات يساعد على تجديد الطاقة.",
          "تجنب التدخين والابتعاد عن العادات الضارة للحفاظ على الرئتين."
        ]
      };

      /* 
      // Real implementation:
      const res = await apiRequest("POST", "/api/posters/generate", data);
      return await res.json();
      */
    },
  });
}
