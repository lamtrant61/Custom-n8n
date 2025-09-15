// import { createHmac } from 'crypto';
import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes, TriggerCloseError } from 'n8n-workflow';

import {
	getEvents,
	verifyToken,
	// webexApiRequest,
	// webexApiRequestAllItems,
} from './GenericFunctions';

export class ICTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IC Trigger',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-name-miscased
		name: 'ICTrigger',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:IC.png',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ":" + $parameter["event"]}}',
		description: 'Starts the workflow when IC events occur.',
		defaults: {
			name: 'IC Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'bearerAuthApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Chat',
						value: 'chat',
					},
				],
				default: 'chat',
				required: true,
			},
			...getEvents(),
		],
	};

	webhookMethods = {
		default: {
			// 3 hàm này dùng để đăng ký webhook cho bên thứ 3, tham khảo ở node webex
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// eslint-disable-next-line prefer-const
		let bodyData = this.getBodyData();
		const headers = this.getHeaderData() as IDataObject;
		const token = headers['authorization'] as string;
		// console.log('headers !!!!!!!	', headers);

		if (token.startsWith('Bearer ') && !verifyToken(token.split('Bearer ')[1])) {
			throw new TriggerCloseError(this.getNode(), {
				cause: new Error('Invalid token'),
				level: 'warning',
			});
		}

		// const req = this.getRequestObject();

		// //@ts-ignore
		// const computedSignature = createHmac('sha1', webhookData.secret)
		// 	.update(req.rawBody)
		// 	.digest('hex');

		// if (resolveData) {
		// 	const {
		// 		data: { id },
		// 	} = bodyData as { data: { id: string } };
		// 	bodyData = await webexApiRequest.call(this, 'GET', `/attachment/actions/${id}`);
		// }

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
