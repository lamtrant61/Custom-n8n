import type { MigrationContext, ReversibleMigration } from '../migration-types';

export class CreateTenantId1608421225232 implements ReversibleMigration {
	async up({ queryRunner, tablePrefix }: MigrationContext) {
		// 1. Tạo bảng tenant
		await queryRunner.query(`
			CREATE TABLE ${tablePrefix}tenant (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				name VARCHAR NOT NULL UNIQUE,
				subdomain VARCHAR DEFAULT NULL,
				logo VARCHAR DEFAULT NULL,
				status BOOLEAN NOT NULL DEFAULT true,
				"createdAt" TIMESTAMP NOT NULL DEFAULT now(),
				"updatedAt" TIMESTAMP NOT NULL DEFAULT now()
			)
		`);

		// 2. Thêm cột tenantId vào bảng "user"
		await queryRunner.query(`
			ALTER TABLE "${tablePrefix}user"
			ADD COLUMN "tenantId" UUID
		`);

		// 3. Tạo foreign key từ user.tenantId → tenant.id
		await queryRunner.query(`
			ALTER TABLE "${tablePrefix}user"
			ADD CONSTRAINT FK_${tablePrefix}user_tenant FOREIGN KEY ("tenantId")
			REFERENCES ${tablePrefix}tenant(id)
			ON DELETE RESTRICT
		`);
	}

	async down({ queryRunner, tablePrefix }: MigrationContext) {
		// 1. Xoá foreign key
		await queryRunner.query(`
			ALTER TABLE "${tablePrefix}user"
			DROP CONSTRAINT FK_${tablePrefix}user_tenant
		`);

		// 2. Xoá cột tenantId
		await queryRunner.query(`
			ALTER TABLE "${tablePrefix}user"
			DROP COLUMN "tenantId"
		`);

		// 3. Xoá bảng tenant
		await queryRunner.query(`
			DROP TABLE ${tablePrefix}tenant
		`);
	}
}
