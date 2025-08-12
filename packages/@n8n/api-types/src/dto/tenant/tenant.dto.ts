import { z } from 'zod';
import { Z } from 'zod-class';

export class TenantCreateRequest extends Z.class({
	name: z.string().min(2).max(100),
	subdomain: z.string().min(2).max(100).optional(),
	logo: z.string().url().optional(),
}) {}

export class TenantUpdateRequest extends Z.class({
	id: z.string().uuid(),
	name: z.string().min(2).max(100).optional(),
	subdomain: z.string().min(2).max(100).optional(),
	logo: z.string().url().optional(),
	status: z.boolean().optional(),
}) {}
