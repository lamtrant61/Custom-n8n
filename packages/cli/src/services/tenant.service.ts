import { Logger } from '@n8n/backend-common';
import { Tenant, TenantRepository } from '@n8n/db';
import { Service } from '@n8n/di';

import { InternalServerError } from '@/errors/response-errors/internal-server.error';

@Service()
export class TenantService {
	constructor(
		private readonly logger: Logger,
		private readonly tenantRepository: TenantRepository,
	) {}

	/** Lấy tất cả tenants */
	async findAll() {
		return await this.tenantRepository.find();
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
		// Object.assign(tenant, data);
		// return await this.tenantRepository.save(tenant);
	}

	/** Xoá tenant */
	async delete(id: string) {
		try {
			await this.tenantRepository.deleteTenant(id);
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
