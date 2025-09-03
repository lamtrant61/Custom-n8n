import { z } from 'zod';
import { Z } from 'zod-class';

export class ResolveListTenant extends Z.class({
	name: z.string().default(''),
	subdomain: z.string().default(''),
	status: z.string().default(''),
	page: z.string().default('1'),
	limit: z.string().min(1).default('10'),
}) {}
