import { z } from 'zod';
import { Z } from 'zod-class';

export class TenantCreateRequest extends Z.class({
	name: z.string().min(2).max(100),
	subdomain: z.string().min(2).max(100).optional(),
	logo: z.string().url().optional(),
}) {}

export class TenantUpdateRequest extends Z.class({
	name: z.string().min(2).max(100).optional(),
	subdomain: z.string().min(2).max(100).optional(),
	logo: z.string().url().optional(),
	status: z
		.preprocess((val) => {
			if (val === 'true') return true;
			if (val === 'false') return false;
			return val;
		}, z.boolean())
		.optional(),
}) {}
