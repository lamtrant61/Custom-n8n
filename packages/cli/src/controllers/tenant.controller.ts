import {
	Get,
	Post,
	Patch,
	Delete,
	Param,
	Body,
	Query,
	RestController,
	GlobalScope,
} from '@n8n/decorators';

import { TenantCreateRequest, TenantUpdateRequest, ResolveListTenant } from '@n8n/api-types';
import { AuthenticatedRequest } from '@n8n/db';
// import { Response } from 'express';

import { TenantService } from '@/services/tenant.service';
import { BadRequestError } from '@/errors/response-errors/bad-request.error';
import { NotFoundError } from '@/errors/response-errors/not-found.error';
import { FilterTenant } from '@/types/tenant.types';

@RestController('/tenants')
export class TenantsController {
	constructor(private readonly tenantService: TenantService) {}

	@Get('/')
	@GlobalScope('tenant:list')
	async listTenants(_req: AuthenticatedRequest, _res: Response, @Query payload: ResolveListTenant) {
		const { name, subdomain, status } = payload;
		const filter: FilterTenant = {};
		const page = parseInt(payload.page) || 1;
		const limit = parseInt(payload.limit) || 10;
		if (name) filter.name = name;
		if (subdomain) filter.subdomain = subdomain;
		if (status !== '') filter.status = status === 'true' ? true : false;
		return await this.tenantService.findAll(filter, page, limit);
	}

	@Get('/:id')
	@GlobalScope('tenant:read')
	async getTenant(_req: AuthenticatedRequest, _res: Response, @Param('id') id: string) {
		const tenant = await this.tenantService.findById(id);
		if (!tenant) {
			throw new NotFoundError(`Tenant with id ${id} not found`);
		}
		return tenant;
	}

	@Post('/')
	@GlobalScope('tenant:create')
	async createTenant(
		_req: AuthenticatedRequest,
		_res: Response,
		@Body payload: TenantCreateRequest,
	) {
		// Kiểm tra trùng tên
		const existing = await this.tenantService.findByName(payload.name);
		if (existing) {
			throw new BadRequestError(`Tenant name "${payload.name}" already exists`);
		}
		return await this.tenantService.create(payload);
	}

	@Patch('/:id')
	@GlobalScope('tenant:update')
	async updateTenant(
		_req: AuthenticatedRequest,
		_res: Response,
		@Param('id') id: string,
		@Body payload: TenantUpdateRequest,
	) {
		const tenant = await this.tenantService.update(id, payload);
		if (!tenant) {
			throw new NotFoundError(`Tenant with id ${id} not found`);
		}
		return tenant;
	}

	@Delete('/:id')
	@GlobalScope('tenant:delete')
	async deleteTenant(_req: AuthenticatedRequest, _res: Response, @Param('id') id: string) {
		const deleted = await this.tenantService.delete(id);
		if (!deleted) {
			throw new NotFoundError(`Tenant with id ${id} not found`);
		}
		return { success: true };
	}
}
