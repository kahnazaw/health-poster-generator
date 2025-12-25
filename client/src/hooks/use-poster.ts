import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface GeneratePosterRequest {
  topic: string;
  centerName: string;
  orientation: "portrait" | "landscape";
}

export interface PosterContent {
  title: string;
  points: string[];
}

export function useGeneratePoster() {
  return useMutation({
    mutationFn: async (data: GeneratePosterRequest): Promise<PosterContent> => {
      const res = await apiRequest("POST", "/api/posters/generate", data);
      return await res.json();
    },
  });
}
