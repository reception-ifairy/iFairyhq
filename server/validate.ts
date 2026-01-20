import { z } from 'zod';

export const zUuid = z.string().uuid();
export const zSlug = z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, 'invalid slug');

export const zProductUpsert = z.object({
  name: z.string().min(1).max(255),
  slug: zSlug,
  description: z.string().max(65535).optional().nullable(),
  status: z.string().min(1).max(32).optional().default('draft'),
});

export const zBotUpsert = z.object({
  name: z.string().min(1).max(255),
  slug: zSlug,
  description: z.string().max(65535).optional().nullable(),
  model: z.string().max(128).optional().nullable(),
  prompt: z.string().max(65535).optional().nullable(),
  temperature: z.number().min(0).max(2).optional().nullable(),
  is_active: z.boolean().optional().default(true),
});

export const zToolUpsert = z.object({
  name: z.string().min(1).max(255),
  slug: zSlug,
  description: z.string().max(65535).optional().nullable(),
  endpoint: z.string().max(512).optional().nullable(),
});

export const zFrontpageModuleUpsert = z.object({
  key: z.string().min(1).max(64),
  title: z.string().max(255).optional().nullable(),
  is_enabled: z.boolean().optional().default(true),
  sort_order: z.number().int().optional().default(0),
  content: z.any().optional().default({}),
});

export const zLeadCreate = z.object({
  email: z.string().email().optional().nullable(),
  full_name: z.string().max(255).optional().nullable(),
  role: z.string().max(64).optional().nullable(),
  interest: z.string().max(255).optional().nullable(),
  message: z.string().max(65535).optional().nullable(),
  source: z.string().max(64).optional().nullable(),
});

export const zCredentialUpsert = z.object({
  service: z.string().min(1).max(64),
  label: z.string().max(255).optional().nullable(),
  api_key: z.string().min(1),
  metadata: z.any().optional().default({}),
  is_active: z.boolean().optional().default(true),
  admin_id: zUuid,
});

