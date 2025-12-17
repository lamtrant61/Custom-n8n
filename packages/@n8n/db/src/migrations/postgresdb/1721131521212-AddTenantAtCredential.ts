import type { MigrationContext, ReversibleMigration } from '../migration-types';

export class AddTenantAtCredential1721131521212 implements ReversibleMigration {
	async up({ queryRunner, tablePrefix }: MigrationContext) {
		const credentialTable = `${tablePrefix}credentials_entity`;
		const fkCredential = `FK_${tablePrefix}credentials_tenant`;

		// 1. Xử lý credential
		const credentialTableDef = await queryRunner.getTable(credentialTable);
		const hasTenantIdCredential = credentialTableDef?.columns.some((c) => c.name === 'tenantId');

		if (!hasTenantIdCredential) {
			await queryRunner.query(`
			ALTER TABLE "${credentialTable}"
			ADD COLUMN "tenantId" UUID
		`);
		}

		const hasFkCredential = credentialTableDef?.foreignKeys.some(
			(fk) => fk.name === fkCredential.toLowerCase(),
		);
		if (!hasFkCredential) {
			await queryRunner.query(`
			ALTER TABLE "${credentialTable}"
			ADD CONSTRAINT ${fkCredential} FOREIGN KEY ("tenantId")
			REFERENCES ${tablePrefix}tenant(id)
			ON DELETE CASCADE
		`);
		}
	}

	async down({ queryRunner, tablePrefix }: MigrationContext) {
		// 1. Xóa ở bảng credential
		await queryRunner.query(`
			ALTER TABLE "${tablePrefix}credentials_entity"
			DROP CONSTRAINT IF EXISTS FK_${tablePrefix}credentials_tenant
		`);

		await queryRunner.query(`
			ALTER TABLE "${tablePrefix}credentials_entity"
			DROP COLUMN IF EXISTS "tenantId"
		`);
	}
}
