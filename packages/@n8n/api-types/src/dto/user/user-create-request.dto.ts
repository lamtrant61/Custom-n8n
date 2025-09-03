import xss from 'xss';
import { z } from 'zod';
import { Z } from 'zod-class';

const xssCheck = (value: string) =>
	value ===
	xss(value, {
		whiteList: {}, // no tags are allowed
	});

const URL_REGEX = /^(https?:\/\/|www\.)|(\.[\p{L}\d-]+)/iu;
const urlCheck = (value: string) => !URL_REGEX.test(value);

const nameSchema = () =>
	z
		.string()
		.min(1)
		.max(32)
		.refine(xssCheck, {
			message: 'Potentially malicious string',
		})
		.refine(urlCheck, {
			message: 'Potentially malicious string',
		});

export class UserCreateRequestDto extends Z.class({
	email: z.string().email(),
	firstName: nameSchema().optional(),
	lastName: nameSchema().optional(),
	tenantId: z.string().uuid(),
	tenantRole: z.preprocess(
		(val) => {
			if (val === 1) return '1';
			if (val === 2) return '2';
			return val;
		},
		z.enum(['1', '2']).default('2'),
	),
}) {}
