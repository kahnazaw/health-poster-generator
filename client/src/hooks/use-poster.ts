import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export interface CreatePosterRequest {
  topicId: number;
  centerName: string;
  orientation: "portrait" | "landscape";
}

export interface PosterContent {
  title: string;
  points: string[];
}

export function useCreatePoster() {
  return useMutation({
    mutationFn: async (data: CreatePosterRequest): Promise<{ poster: any; content: PosterContent }> => {
      const res = await apiRequest("POST", "/api/posters", data);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "فشل إنشاء البوستر");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posters/archive"] });
    },
  });
}
