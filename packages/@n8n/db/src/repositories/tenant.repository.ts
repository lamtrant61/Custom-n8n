import { Service } from '@n8n/di';
import {
	Repository,
	DataSource,
	In,
	EntityManager,
	SelectQueryBuilder,
	Brackets,
} from '@n8n/typeorm';
import type { DeepPartial } from '@n8n/typeorm';

import { Tenant } from '../entities/tenant';

@Service()
export class TenantRepository extends Repository<Tenant> {
	constructor(dataSource: DataSource) {
		super(Tenant, dataSource.manager);
	}

	/** Lấy nhiều tenant theo ID */
	async findManyByIds(ids: string[]) {
		return await this.find({
			where: { id: In(ids) },
		});
	}

	async findOneById(id: string) {
		return await this.findOne({ where: { id } });
	}

	/** Tạo mới tenant */
	async createTenant(data: DeepPartial<Tenant>, transactionManager?: EntityManager) {
		const manager = transactionManager ?? this.manager;
		const tenant = manager.create(Tenant, data);
		await manager.save(tenant);
		return await manager.findOne(Tenant, { where: { id: tenant.id } });
	}

	/** Cập nhật tenant */
	async updateTenant(id: string, data: DeepPartial<Tenant>, transactionManager?: EntityManager) {
		const manager = transactionManager ?? this.manager;
		await manager.update(Tenant, { id }, data);
		return await manager.findOne(Tenant, { where: { id } });
	}

	/** Xoá tenant theo ID */
	async deleteTenant(id: string, transactionManager?: EntityManager) {
		const manager = transactionManager ?? this.manager;
		return await manager.delete(Tenant, { id });
	}

	/** Lấy tenant theo tên */
	async findByName(name: string) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return await this.findOne({
			where: { name },
		});
	}

	/** Lọc + phân trang tenant */
	buildTenantQuery(
		filter?: {
			name?: string;
			status?: boolean;
			fullText?: string;
		},
		take?: number,
		skip?: number,
		sortBy?: string[],
	): SelectQueryBuilder<Tenant> {
		const qb = this.createQueryBuilder('tenant');

		if (filter?.name) {
			qb.andWhere('tenant.name = :name', { name: filter.name });
		}

		if (filter?.status !== undefined) {
			qb.andWhere('tenant.status = :status', { status: filter.status });
		}

		if (filter?.fullText) {
			const search = `%${filter.fullText}%`;
			qb.andWhere(
				new Brackets((sub) => {
					sub
						.where('LOWER(tenant.name) LIKE LOWER(:search)', { search })
						.orWhere('LOWER(tenant.description) LIKE LOWER(:search)', { search });
				}),
			);
		}

		if (take !== undefined) qb.take(take);
		if (skip !== undefined) qb.skip(skip);

		if (sortBy?.length) {
			for (const sort of sortBy) {
				const [field, order] = sort.split(':');
				qb.addOrderBy(`tenant.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
			}
		}

		return qb;
	}
}
