import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { userOperations, userFields, customerOperations, customerFields } from './descriptions';
import { getAttachments } from './GenericFunctions';

export class IC implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IC',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-name-miscased
		name: 'IC',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:IC.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'IC',
		defaults: {
			name: 'IC',
		},
		usableAsTool: true,
		credentials: [
			{
				name: 'bearerAuthApi',
				required: true,
			},
		],
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Customer',
						value: 'customer',
					},
				],
				default: 'user',
			},
			...userOperations,
			...customerOperations,
			...userFields,
			...customerFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		// const timezone = this.getTimezone();
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		let responseData;
		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'user') {
					// **********************************************************************
					//                                user
					// **********************************************************************

					if (operation === 'create') {
						// ----------------------------------------
						//             user: create
						// ----------------------------------------

						const destination = this.getNodeParameter('destination', i);
						const file = this.getNodeParameter(
							'additionalFields.fileUi.fileValue',
							i,
							{},
						) as IDataObject;
						const markdown = this.getNodeParameter('additionalFields.markdown', i, '') as boolean;
						const body = {} as IDataObject;
						if (destination === 'room') {
							body.roomId = this.getNodeParameter('roomId', i);
						}

						if (destination === 'person') {
							const specifyPersonBy = this.getNodeParameter('specifyPersonBy', 0) as string;
							if (specifyPersonBy === 'id') {
								body.toPersonId = this.getNodeParameter('toPersonId', i);
							} else {
								body.toPersonEmail = this.getNodeParameter('toPersonEmail', i);
							}
						}

						if (markdown) {
							body.markdown = markdown;
						}

						body.text = this.getNodeParameter('text', i);

						body.attachments = getAttachments(
							this.getNodeParameter(
								'additionalFields.attachmentsUi.attachmentValues',
								i,
								[],
							) as IDataObject[],
						);

						if (Object.keys(file).length) {
							const isBinaryData = file.fileLocation === 'binaryData' ? true : false;

							if (isBinaryData) {
								const binaryPropertyName = file.binaryPropertyName as string;
								const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
								const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(
									i,
									binaryPropertyName,
								);

								const formData = {
									files: {
										value: binaryDataBuffer,
										options: {
											filename: binaryData.fileName,
											contentType: binaryData.mimeType,
										},
									},
								};
								Object.assign(body, formData);
							} else {
								const url = file.url as string;
								Object.assign(body, { files: url });
							}
						}

						// if (file.fileLocation === 'binaryData') {
						//     responseData = await webexApiRequest.call(
						//         this,
						//         'POST',
						//         '/messages',
						//         {},
						//         {},
						//         undefined,
						//         { formData: body },
						//     );
						// } else {
						//     responseData = await webexApiRequest.call(this, 'POST', '/messages', body);
						// }
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'delete') {
						// ----------------------------------------
						//             message: delete
						// ----------------------------------------

						// https://developer.webex.com/docs/api/v1/messages/delete-a-message
						// const messageId = this.getNodeParameter('messageId', i);

						// const endpoint = `/messages/${messageId}`;
						// responseData = await webexApiRequest.call(this, 'DELETE', endpoint);
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray({ success: true }),
							{ itemData: { item: i } },
						);
					} else if (operation === 'get') {
						// ----------------------------------------
						//               message: get
						// ----------------------------------------

						// https://developer.webex.com/docs/api/v1/messages/get-message-details
						// const messageId = this.getNodeParameter('messageId', i);

						// const endpoint = `/messages/${messageId}`;
						// responseData = await webexApiRequest.call(this, 'GET', endpoint);
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'getAll') {
						// ----------------------------------------
						//             message: getAll
						// ----------------------------------------

						const qs: IDataObject = {
							roomId: this.getNodeParameter('roomId', i),
						};
						const filters = this.getNodeParameter('filters', i);
						// const returnAll = this.getNodeParameter('returnAll', i);

						if (Object.keys(filters).length) {
							Object.assign(qs, filters);
						}

						// if (returnAll) {
						//     responseData = await webexApiRequestAllItems.call(
						//         this,
						//         'items',
						//         'GET',
						//         '/messages',
						//         {},
						//         qs,
						//     );
						// } else {
						//     qs.max = this.getNodeParameter('limit', i);
						//     // responseData = await webexApiRequest.call(this, 'GET', '/messages', {}, qs);
						//     responseData = responseData.items;
						// }
						// responseData = this.helpers.constructExecutionMetaData(
						//     this.helpers.returnJsonArray(responseData.items as IDataObject[]),
						//     { itemData: { item: i } },
						// );
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'update') {
						// ----------------------------------------
						//             message: update
						// ----------------------------------------

						// https://developer.webex.com/docs/api/v1/messages/edit-a-message
						// const messageId = this.getNodeParameter('messageId', i) as string;
						// const markdown = this.getNodeParameter('markdown', i) as boolean;

						// const endpoint = `/messages/${messageId}`;

						// responseData = await webexApiRequest.call(this, 'GET', endpoint);

						// const body = {
						//     roomId: responseData.roomId,
						// } as IDataObject;

						// if (markdown) {
						//     body.markdown = this.getNodeParameter('markdownText', i);
						// } else {
						//     body.text = this.getNodeParameter('text', i);
						// }

						// responseData = await webexApiRequest.call(this, 'PUT', endpoint, body);
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject[]),
							{ itemData: { item: i } },
						);
					}
				} else if (resource === 'customer') {
					// **********************************************************************
					//                                customer
					// **********************************************************************

					if (operation === 'create') {
						// ----------------------------------------
						//             customer: create
						// ----------------------------------------

						const destination = this.getNodeParameter('destination', i);
						const file = this.getNodeParameter(
							'additionalFields.fileUi.fileValue',
							i,
							{},
						) as IDataObject;
						const markdown = this.getNodeParameter('additionalFields.markdown', i, '') as boolean;
						const body = {} as IDataObject;
						if (destination === 'room') {
							body.roomId = this.getNodeParameter('roomId', i);
						}

						if (destination === 'person') {
							const specifyPersonBy = this.getNodeParameter('specifyPersonBy', 0) as string;
							if (specifyPersonBy === 'id') {
								body.toPersonId = this.getNodeParameter('toPersonId', i);
							} else {
								body.toPersonEmail = this.getNodeParameter('toPersonEmail', i);
							}
						}

						if (markdown) {
							body.markdown = markdown;
						}

						body.text = this.getNodeParameter('text', i);

						body.attachments = getAttachments(
							this.getNodeParameter(
								'additionalFields.attachmentsUi.attachmentValues',
								i,
								[],
							) as IDataObject[],
						);

						if (Object.keys(file).length) {
							const isBinaryData = file.fileLocation === 'binaryData' ? true : false;

							if (isBinaryData) {
								const binaryPropertyName = file.binaryPropertyName as string;
								const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
								const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(
									i,
									binaryPropertyName,
								);

								const formData = {
									files: {
										value: binaryDataBuffer,
										options: {
											filename: binaryData.fileName,
											contentType: binaryData.mimeType,
										},
									},
								};
								Object.assign(body, formData);
							} else {
								const url = file.url as string;
								Object.assign(body, { files: url });
							}
						}

						// if (file.fileLocation === 'binaryData') {
						//     responseData = await webexApiRequest.call(
						//         this,
						//         'POST',
						//         '/messages',
						//         {},
						//         {},
						//         undefined,
						//         { formData: body },
						//     );
						// } else {
						//     responseData = await webexApiRequest.call(this, 'POST', '/messages', body);
						// }
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'delete') {
						// ----------------------------------------
						//             customer: delete
						// ----------------------------------------

						// https://developer.webex.com/docs/api/v1/messages/delete-a-message
						// const messageId = this.getNodeParameter('messageId', i);

						// const endpoint = `/messages/${messageId}`;
						// responseData = await webexApiRequest.call(this, 'DELETE', endpoint);
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray({ success: true }),
							{ itemData: { item: i } },
						);
					} else if (operation === 'get') {
						// ----------------------------------------
						//               customer: get
						// ----------------------------------------

						// https://developer.webex.com/docs/api/v1/messages/get-message-details
						// const messageId = this.getNodeParameter('messageId', i);

						// const endpoint = `/messages/${messageId}`;
						// responseData = await webexApiRequest.call(this, 'GET', endpoint);
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'getAll') {
						// ----------------------------------------
						//             customer: getAll
						// ----------------------------------------

						const qs: IDataObject = {
							roomId: this.getNodeParameter('roomId', i),
						};
						const filters = this.getNodeParameter('filters', i);
						// const returnAll = this.getNodeParameter('returnAll', i);

						if (Object.keys(filters).length) {
							Object.assign(qs, filters);
						}

						// if (returnAll) {
						//     responseData = await webexApiRequestAllItems.call(
						//         this,
						//         'items',
						//         'GET',
						//         '/messages',
						//         {},
						//         qs,
						//     );
						// } else {
						//     qs.max = this.getNodeParameter('limit', i);
						//     // responseData = await webexApiRequest.call(this, 'GET', '/messages', {}, qs);
						//     responseData = responseData.items;
						// }
						// responseData = this.helpers.constructExecutionMetaData(
						//     this.helpers.returnJsonArray(responseData.items as IDataObject[]),
						//     { itemData: { item: i } },
						// );
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'update') {
						// ----------------------------------------
						//             customer: update
						// ----------------------------------------

						// https://developer.webex.com/docs/api/v1/messages/edit-a-message
						// const messageId = this.getNodeParameter('messageId', i) as string;
						// const markdown = this.getNodeParameter('markdown', i) as boolean;

						// const endpoint = `/messages/${messageId}`;

						// responseData = await webexApiRequest.call(this, 'GET', endpoint);

						// const body = {
						//     roomId: responseData.roomId,
						// } as IDataObject;

						// if (markdown) {
						//     body.markdown = this.getNodeParameter('markdownText', i);
						// } else {
						//     body.text = this.getNodeParameter('text', i);
						// }

						// responseData = await webexApiRequest.call(this, 'PUT', endpoint, body);
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject[]),
							{ itemData: { item: i } },
						);
					}
				}

				returnData.push(...(responseData as INodeExecutionData[]));
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.toString(), json: {}, itemIndex: i });
					continue;
				}

				throw error;
			}
		}
		return [returnData];
	}
}
