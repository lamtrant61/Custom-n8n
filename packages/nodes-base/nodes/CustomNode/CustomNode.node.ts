/* eslint-disable n8n-nodes-base/node-class-description-credentials-name-unsuffixed */
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { poolConnection } from '../../utils/poolConnection';

export class CustomNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'My Custom Node Connect DB',
		name: 'customNode',
		icon: {
			light: 'file:icon.svg',
			dark: 'file:icon.svg',
		},
		group: ['transform'],
		version: 1,
		description: 'My first custom node',
		defaults: {
			name: 'My Custom Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'icOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: 'test name',
			},
			{
				displayName: 'Age',
				name: 'age',
				type: 'number',
				default: 8,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const message = this.getNodeParameter('name', 0) as string;
		console.log(message);
		console.log('message here!!!!!!!!!');

		const pool = poolConnection();
		const client = await pool.connect();
		// const userId = this.getNodeParameter('userId', 0) as string;
		const query = 'SELECT * FROM "user" WHERE id = $1';
		const values = [message];
		let userInfo;
		try {
			const res = await client.query(query, values);
			// console.log('res', res, 'my resssss');

			userInfo = res.rows[0];
		} catch (error) {
			console.error('Error executing query', error);
		}
		// const user = {message: 'Hello from custom node!'};
		console.log('user', userInfo);

		return [this.helpers.returnJsonArray([userInfo as any])];
	}
}
