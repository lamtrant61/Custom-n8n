import type { MigrationContext, ReversibleMigration } from '../migration-types';

export class AddTenantAtWorkflow1715211125131 implements ReversibleMigration {
	async up({ queryRunner, tablePrefix }: MigrationContext) {
		const workflowTable = `${tablePrefix}workflow_entity`;
		const fkWorkflow = `FK_${tablePrefix}workflow_tenant`;

		// 1. Xử lý workflow
		const workflowTableDef = await queryRunner.getTable(workflowTable);
		const hasTenantIdWorkflow = workflowTableDef?.columns.some((c) => c.name === 'tenantId');

		if (!hasTenantIdWorkflow) {
			await queryRunner.query(`
			ALTER TABLE "${workflowTable}"
			ADD COLUMN "tenantId" UUID
		`);
		}

		const hasFkWorkflow = workflowTableDef?.foreignKeys.some(
			(fk) => fk.name === fkWorkflow.toLowerCase(),
		);
		if (!hasFkWorkflow) {
			await queryRunner.query(`
			ALTER TABLE "${workflowTable}"
			ADD CONSTRAINT ${fkWorkflow} FOREIGN KEY ("tenantId")
			REFERENCES ${tablePrefix}tenant(id)
			ON DELETE CASCADE
		`);
		}
	}

	async down({ queryRunner, tablePrefix }: MigrationContext) {
		// 1. Xóa ở bảng workflow
		await queryRunner.query(`
			ALTER TABLE "${tablePrefix}workflow_entity"
			DROP CONSTRAINT IF EXISTS FK_${tablePrefix}workflow_tenant
		`);

		await queryRunner.query(`
			ALTER TABLE "${tablePrefix}workflow_entity"
			DROP COLUMN IF EXISTS "tenantId"
		`);
	}
}
