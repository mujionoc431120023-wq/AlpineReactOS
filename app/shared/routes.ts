
import { z } from 'zod';
import { insertFileSchema, files, settings, insertSettingsSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  fs: {
    list: {
      method: 'GET' as const,
      path: '/api/fs/list',
      input: z.object({ path: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof files.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/fs/create',
      input: insertFileSchema,
      responses: {
        201: z.custom<typeof files.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/fs/:id',
      input: insertFileSchema.partial(),
      responses: {
        200: z.custom<typeof files.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/fs/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    getContent: {
      method: 'GET' as const,
      path: '/api/fs/content/:id',
      responses: {
        200: z.object({ content: z.string() }),
        404: errorSchemas.notFound,
      },
    },
  },
  system: {
    execute: {
      method: 'POST' as const,
      path: '/api/system/execute',
      input: z.object({
        command: z.string(),
        args: z.array(z.string()),
        cwd: z.string(),
      }),
      responses: {
        200: z.object({
          output: z.string(),
          error: z.string().optional(),
          exitCode: z.number(),
          newCwd: z.string().optional(),
        }),
      },
    },
    settings: {
      get: {
        method: 'GET' as const,
        path: '/api/system/settings',
        responses: {
          200: z.custom<typeof settings.$inferSelect>(),
        },
      },
      update: {
        method: 'PUT' as const,
        path: '/api/system/settings',
        input: insertSettingsSchema.partial(),
        responses: {
          200: z.custom<typeof settings.$inferSelect>(),
        },
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
