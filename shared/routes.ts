import { z } from 'zod';
import { insertPosterSchema, posters } from './schema';

export const api = {
  posters: {
    generate: {
      method: 'POST' as const,
      path: '/api/posters/generate',
      input: z.object({
        topic: z.string(),
        centerName: z.string(),
        orientation: z.enum(['portrait', 'landscape']),
      }),
      responses: {
        200: z.object({
          title: z.string(),
          points: z.array(z.string()),
        }),
        500: z.object({ message: z.string() }),
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/posters',
      responses: {
        200: z.array(z.custom<typeof posters.$inferSelect>()),
      },
    },
  },
};
