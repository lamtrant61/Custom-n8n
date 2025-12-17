/* eslint-disable n8n-nodes-base/node-class-description-credentials-name-unsuffixed */
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
// import { poolConnection } from '../../utils/poolConnection';

export class CustomNode2 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'My Custom Node Connect DB 2',
		name: 'customNode2',
		icon: {
			light: 'file:icon.svg',
			dark: 'file:icon.svg',
		},
		group: ['transform'],
		version: 1,
		description: 'My first custom node',
		defaults: {
			name: 'My Custom Node 2',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'ic2OAuth2Api',
				// name: 'icOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: 'test message',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('ic2OAuth2Api');
		console.log(credentials, 'credentials!!!!!!!');
		// const webhookUrl = credentials.webhookUrl as string;

		for (let i = 0; i < items.length; i++) {
			const message = this.getNodeParameter('message', i) as string;

			// await this.helpers.httpRequest({
			// 	method: 'POST',
			// 	url: webhookUrl,
			// 	body: {
			// 		text: message,
			// 	},
			// 	json: true,
			// });

			returnData.push({ json: { success: true, message } });
		}
		return [returnData];
	}
}
