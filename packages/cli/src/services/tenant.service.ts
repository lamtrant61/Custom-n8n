import { Logger } from '@n8n/backend-common';
import { Tenant, TenantRepository } from '@n8n/db';
import { Service } from '@n8n/di';

import { InternalServerError } from '@/errors/response-errors/internal-server.error';
import { FilterTenant } from '@/types/tenant.types';

@Service()
export class TenantService {
	constructor(
		private readonly logger: Logger,
		private readonly tenantRepository: TenantRepository,
	) {}

	/** Lấy tất cả tenants */
	async findAll(filter: FilterTenant, page: number = 1, limit: number = 10) {
		this.logger.info('Finding all tenants', { filter, page, limit });
		const tenantQuery = this.tenantRepository.buildTenantQuery(
			{ ...filter },
			limit,
			(page - 1) * limit,
		);
		const [rows, total] = await tenantQuery.getManyAndCount();
		return { count: total, items: rows };
	}

	/** Lấy tenant theo ID */
	async findById(id: string) {
		const tenant = await this.tenantRepository.findOneById(id);
		this.logger.info('Finding tenant by ID', { id, tenant });
		return tenant;
	}

	/** Lấy tenant theo tên (an toàn) */
	async findByName(name: string) {
		if (!name) return null;
		return await this.tenantRepository.findByName(name);
		// return await this.tenantRepository
		// 	.createQueryBuilder('tenant')
		// 	.where('LOWER(tenant.name) = LOWER(:name)', { name: name.trim() })
		// 	.getOne();
	}

	/** Tạo mới tenant */
	async create(data: Partial<Tenant>) {
		try {
			return await this.tenantRepository.createTenant(data);
		} catch (error) {
			this.logger.error('Failed to create tenant', { error, data });
			throw new InternalServerError('An error occurred while creating tenant', error);
		}
	}

	/** Cập nhật tenant */
	async update(id: string, data: Partial<Tenant>) {
		const tenant = await this.findById(id);
		if (!tenant) {
			return null;
		}
		return await this.tenantRepository.updateTenant(id, data);
	}

	/** Xoá tenant */
	async delete(id: string) {
		try {
			const searchTenant = await this.tenantRepository.findOneById(id);
			if (!searchTenant) throw new Error('Cannot find tenant id - service tenant');
			const tenant = await this.tenantRepository.deleteTenant(id);
			if (tenant === null || !tenant.isDeleted)
				throw new Error('Cannot delete tenant - service tenant');
			return true;
		} catch (error) {
			this.logger.error('Failed to delete tenant', { error, id });
			throw new InternalServerError('An error occurred while deleting tenant', error);
		}
	}

	/** Trả dữ liệu public của tenant */
	toPublic(tenant: Tenant) {
		// Lọc các field nhạy cảm nếu có
		const { id, name, subdomain, logo, status, createdAt, updatedAt } = tenant;
		return { id, name, subdomain, logo, status, createdAt, updatedAt };
	}

	/** Lấy manager để dùng transaction ngoài service */
	getManager() {
		return this.tenantRepository.manager;
	}
}
