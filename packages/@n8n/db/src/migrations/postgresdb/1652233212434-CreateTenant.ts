import type { MigrationContext, ReversibleMigration } from '../migration-types';

<<<<<<<< HEAD:packages/@n8n/db/src/migrations/postgresdb/1652233212434-CreateTenant.ts
export class CreateTenantId1652233212434 implements ReversibleMigration {
========
export class CreateTenantId1708421225232 implements ReversibleMigration {
>>>>>>>> main-tenant:packages/@n8n/db/src/migrations/postgresdb/1708421225232-CreateTenant.ts
	async up({ queryRunner, tablePrefix }: MigrationContext) {
		const userTable = `${tablePrefix}user`;
		const fkName = `FK_${tablePrefix}user_tenant`;

		// 1. Tạo bảng tenant
		await queryRunner.query(`
			CREATE TABLE IF NOT EXISTS ${tablePrefix}tenant (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				name VARCHAR NOT NULL UNIQUE,
				subdomain VARCHAR DEFAULT NULL,
				logo VARCHAR DEFAULT NULL,
				status BOOLEAN NOT NULL DEFAULT true,
				"isDeleted" BOOLEAN NOT NULL DEFAULT false,
				"createdAt" TIMESTAMP NOT NULL DEFAULT now(),
				"updatedAt" TIMESTAMP NOT NULL DEFAULT now()
			)
		`);

<<<<<<<< HEAD:packages/@n8n/db/src/migrations/postgresdb/1652233212434-CreateTenant.ts
		// 2. Thêm tenantId
		await queryRunner.query(`
			ALTER TABLE "${tablePrefix}user"
			ADD COLUMN "tenantId" UUID
		`);
========
		// 2. Thêm cột tenantId vào bảng "user"
		const userTableDef = await queryRunner.getTable(userTable);
		const hasTenantId = userTableDef?.columns.some((c) => c.name === 'tenantId');

		if (!hasTenantId) {
			await queryRunner.query(`
				ALTER TABLE "${tablePrefix}user"
				ADD COLUMN "tenantId" UUID
			`);
		}
>>>>>>>> main-tenant:packages/@n8n/db/src/migrations/postgresdb/1708421225232-CreateTenant.ts

		// Thêm tenantRole
		await queryRunner.query(`
			ALTER TABLE "${tablePrefix}user"
			ADD COLUMN "tenantRole" VARCHAR NOT NULL DEFAULT '2'
		`);

		// 3. Tạo foreign key từ user.tenantId → tenant.id
		const hasFk = userTableDef?.foreignKeys.some((fk) => fk.name === fkName.toLowerCase());

		if (!hasFk) {
			await queryRunner.query(`
				ALTER TABLE "${tablePrefix}user"
				ADD CONSTRAINT FK_${tablePrefix}user_tenant FOREIGN KEY ("tenantId")
				REFERENCES ${tablePrefix}tenant(id)
				ON DELETE RESTRICT
			`);
		}
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

		// 3. Xoá cột tenantRole
		await queryRunner.query(`
			ALTER TABLE "${tablePrefix}user"
			DROP COLUMN "tenantRole"
		`);

		// 4. Xoá bảng tenant
		await queryRunner.query(`
			DROP TABLE ${tablePrefix}tenant
		`);
	}
}
