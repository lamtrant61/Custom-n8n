import { Service } from '@n8n/di';
import { DataSource, Repository, DeepPartial } from '@n8n/typeorm';

import { WorkflowTagMapping } from '../entities';

@Service()
export class WorkflowTagMappingRepository extends Repository<WorkflowTagMapping> {
	constructor(dataSource: DataSource) {
		super(WorkflowTagMapping, dataSource.manager);
	}

	async overwriteTaggings(workflowId: string, tagIds: string[]) {
		return await this.manager.transaction(async (tx) => {
			await tx.delete(WorkflowTagMapping, { workflowId });

			const taggings = tagIds.map((tagId) => this.create({ workflowId, tagId })) as Array<
				DeepPartial<WorkflowTagMapping>
			>;

			return await tx.insert(WorkflowTagMapping, taggings);
		});
	}
}
