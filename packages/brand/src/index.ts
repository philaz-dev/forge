import { z } from "zod";

/**
 * Brand domain package.
 *
 * Brand creation is intentionally NOT implemented in Sprint 001. This schema
 * defines the shape of a Brand only, so downstream packages can share a single
 * source of truth once creation is built in a later sprint.
 */
export const brandSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

export type Brand = z.infer<typeof brandSchema>;
