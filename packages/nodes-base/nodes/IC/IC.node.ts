import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ICredentialDataDecryptedObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeApiError } from 'n8n-workflow';

import {
	userOperations,
	userFields,
	customerOperations,
	customerFields,
	interactionOperations,
	interactionFields,
	ticketOperations,
	ticketFields,
} from './descriptions';
import { icApiRequest } from './GenericFunctions';

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
					{
						name: 'Interaction',
						value: 'interaction',
					},
					{
						name: 'Ticket',
						value: 'ticket',
					},
				],
				default: 'user',
			},
			...userOperations,
			...customerOperations,
			...userFields,
			...customerFields,
			...interactionOperations,
			...interactionFields,
			...ticketOperations,
			...ticketFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		// const timezone = this.getTimezone();
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);
		const credentials = (await this.getCredentials(
			'bearerAuthApi',
		)) as ICredentialDataDecryptedObject;
		const token = credentials.token as string;
		const icUrl = credentials.icUrl as string;

		let responseData;
		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'user') {
					// **********************************************************************
					//                                user
					// **********************************************************************

					if (operation === 'getByUsername') {
						// ----------------------------------------
						//             user: getByUsername
						// ----------------------------------------

						const body = {} as IDataObject;
						body.item = this.getNodeParameter('username', i) as string;

						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const res = await icApiRequest.call(
							this,
							'POST',
							token,
							icUrl,
							resource,
							'api/user/get-by-id',
							body,
						);
						// check status code
						if (res.statusCode !== 200) {
							throw new NodeApiError(
								this.getNode(),
								res.body?.message || 'Unknown error occurred!',
							);
						}
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(res.body?.data as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'getList') {
						// ----------------------------------------
						//             message: getList
						// ----------------------------------------

						const body = {} as IDataObject;
						body.limit = this.getNodeParameter('limit', i) as number;
						body.page = this.getNodeParameter('page', i) as number;

						const sortObj = this.getNodeParameter('sort', i) as IDataObject;
						if (sortObj && sortObj.sort) {
							body.sorts = sortObj.sort;
						}

						const searchListObj = this.getNodeParameter('search_list', i) as IDataObject;
						if (searchListObj && searchListObj.search) {
							body.search_list = searchListObj.search;
						}
						const res = await icApiRequest.call(
							this,
							'POST',
							token,
							icUrl,
							resource,
							'api/user/get-all',
							body,
						);
						if (res.statusCode !== 200) {
							throw new NodeApiError(
								this.getNode(),
								res.body?.message || 'Unknown error occurred!',
							);
						}
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(res.body?.data as IDataObject[]),
							{ itemData: { item: i } },
						);
					}
				} else if (resource === 'customer') {
					// **********************************************************************
					//                                customer
					// **********************************************************************

					if (operation === 'getById') {
						// ----------------------------------------
						//             customer: getById
						// ----------------------------------------

						const body = {} as IDataObject;
						body.item = this.getNodeParameter('id', i) as string;

						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const res = await icApiRequest.call(
							this,
							'POST',
							token,
							icUrl,
							'idstore',
							'api/customer/get-by-id',
							body,
						);
						// check status code
						if (res.statusCode !== 200) {
							throw new NodeApiError(
								this.getNode(),
								res.body?.message || 'Unknown error occurred!',
							);
						}
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(res.body?.data as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'getBySocialId') {
						// ----------------------------------------
						//             customer: getBySocialId
						// ----------------------------------------

						const body = {} as IDataObject;
						body.item = this.getNodeParameter('id', i) as string;

						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const res = await icApiRequest.call(
							this,
							'POST',
							token,
							icUrl,
							'idstore',
							'api/customer/get-by-user-social-id',
							body,
						);
						// check status code
						if (res.statusCode !== 200) {
							throw new NodeApiError(
								this.getNode(),
								res.body?.message || 'Unknown error occurred!',
							);
						}
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(res.body?.data as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'update') {
						// ----------------------------------------
						//             customer: update
						// ----------------------------------------
						const body = {} as IDataObject;
						body.id = this.getNodeParameter('id', i) as string;

						const customer_name = this.getNodeParameter('customer_name', i) as string;
						if (customer_name) body.customer_name = customer_name;

						const birth_date = this.getNodeParameter('birth_date', i) as string;
						if (birth_date) body.birth_date = birth_date;

						const avatar = this.getNodeParameter('avatar', i) as string;
						if (avatar) body.avatar = avatar;

						const address = this.getNodeParameter('address', i) as string;
						if (address) body.address = address;

						const email = this.getNodeParameter('email', i) as string;
						if (email) body.email = email;

						const phone = this.getNodeParameter('phone', i) as string;
						if (phone) body.phone = phone;

						const language = this.getNodeParameter('language', i) as string;
						if (language) body.language = language;

						const country = this.getNodeParameter('country', i) as string;
						if (country) body.country = country;

						body.is_new_customer_webchat = false;

						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const res = await icApiRequest.call(
							this,
							'POST',
							token,
							icUrl,
							'idstore',
							'api/customer/update',
							body,
						);
						// check status code
						if (res.statusCode !== 200) {
							throw new NodeApiError(
								this.getNode(),
								res.body?.message || 'Unknown error occurred!',
							);
						}

						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(res.body?.data as IDataObject[]),
							{ itemData: { item: i } },
						);
					}
				} else if (resource === 'interaction') {
					// **********************************************************************
					//                                interaction
					// **********************************************************************

					if (operation === 'getById') {
						// ----------------------------------------
						//             interaction: getById
						// ----------------------------------------

						const body = {} as IDataObject;
						body.item = this.getNodeParameter('id', i) as string;

						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const res = await icApiRequest.call(
							this,
							'POST',
							token,
							icUrl,
							'idstore',
							'api/interaction/get-by-id',
							body,
						);
						// check status code
						if (res.statusCode !== 200) {
							throw new NodeApiError(
								this.getNode(),
								res.body?.message || 'Unknown error occurred!',
							);
						}
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(res.body?.data as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'update') {
						// ----------------------------------------
						//             interaction: update
						// ----------------------------------------
						const body = {} as IDataObject;
						body.id = this.getNodeParameter('id', i) as string;

						const customer_id = this.getNodeParameter('customer_id', i) as string;
						if (customer_id) body.customer_id = customer_id;

						const user_social_id = this.getNodeParameter('user_social_id', i) as string;
						if (user_social_id) body.user_social_id = user_social_id;

						const page_social_id = this.getNodeParameter('page_social_id', i) as string;
						if (page_social_id) body.page_social_id = page_social_id;

						const channel_type = this.getNodeParameter('channel_type', i) as string;
						if (channel_type) body.channel_type = channel_type;

						const state = this.getNodeParameter('state', i) as string;
						if (state) body.state = state;

						const app_id = this.getNodeParameter('app_id', i) as string;
						if (app_id) body.app_id = app_id;

						const source_address = this.getNodeParameter('source_address', i) as string;
						if (source_address) body.source_address = source_address;

						const tenant_id = this.getNodeParameter('tenant_id', i) as string;
						if (tenant_id) body.tenant_id = tenant_id;

						const is_active = this.getNodeParameter('is_active', i) as boolean;
						body.is_active = is_active;

						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const res = await icApiRequest.call(
							this,
							'POST',
							token,
							icUrl,
							'idstore',
							'api/interaction/update',
							body,
						);
						// check status code
						if (res.statusCode !== 200) {
							throw new NodeApiError(
								this.getNode(),
								res.body?.message || 'Unknown error occurred!',
							);
						}

						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(res.body?.data as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'getListDetail') {
						// ----------------------------------------
						//             message: getListDetail
						// ----------------------------------------

						const body = {} as IDataObject;
						body.limit = this.getNodeParameter('limit', i) as number;
						body.page = this.getNodeParameter('page', i) as number;

						const interaction_id = this.getNodeParameter('interaction_id', i) as string;
						if (interaction_id) body.interaction_id = interaction_id;

						const user_social_id = this.getNodeParameter('user_social_id', i) as string;
						if (user_social_id) body.user_social_id = user_social_id;

						const search_text = this.getNodeParameter('search_text', i) as string;
						if (search_text) body.search_text = search_text;

						const is_all = this.getNodeParameter('is_all', i) as boolean;
						body.is_all = is_all;

						const res = await icApiRequest.call(
							this,
							'POST',
							token,
							icUrl,
							'idstore',
							'api/interactiondetail/get-list-interaction-detail',
							body,
						);
						if (res.statusCode !== 200) {
							throw new NodeApiError(
								this.getNode(),
								res.body?.message || 'Unknown error occurred!',
							);
						}
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(res.body?.data as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'addTag') {
						// ----------------------------------------
						//             interaction: addTag
						// ----------------------------------------
						const body = {} as IDataObject;
						body.id = this.getNodeParameter('id', i) as string;

						const interaction_id = this.getNodeParameter('interaction_id', i) as string;
						if (interaction_id) body.interaction_id = interaction_id;

						const interactiondetail_id = this.getNodeParameter('interactiondetail_id', i) as string;
						if (interactiondetail_id) body.interactiondetail_id = interactiondetail_id;

						const customer_id = this.getNodeParameter('customer_id', i) as string;
						if (customer_id) body.customer_id = customer_id;

						const ticket_id = this.getNodeParameter('ticket_id', i) as string;
						if (ticket_id) body.ticket_id = ticket_id;

						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const res = await icApiRequest.call(
							this,
							'POST',
							token,
							icUrl,
							'idstore',
							'api/interaction-tag/add-tag-to-interaction',
							body,
						);
						// check status code
						if (res.statusCode !== 200) {
							throw new NodeApiError(
								this.getNode(),
								res.body?.message || 'Unknown error occurred!',
							);
						}

						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(res.body?.data as IDataObject[]),
							{ itemData: { item: i } },
						);
					}
				} else if (resource === 'ticket') {
					// **********************************************************************
					//                                ticket
					// **********************************************************************

					if (operation === 'create') {
						// ----------------------------------------
						//             ticket: create
						// ----------------------------------------
						const body = {} as IDataObject;

						const title = this.getNodeParameter('title', i) as string;
						if (title) body.title = title;

						const channel_type = this.getNodeParameter('channel_type', i) as string;
						if (channel_type) body.channel_type = channel_type;

						const customer_id = this.getNodeParameter('customer_id', i) as string;
						if (customer_id) body.customer_id = customer_id;

						const content = this.getNodeParameter('content', i) as string;
						if (content) body.content = content;

						const status = this.getNodeParameter('status', i) as string;
						if (status) body.status = status;

						const assign_to = this.getNodeParameter('assign_to', i) as string;
						if (assign_to) body.assign_to = assign_to;

						const priority = this.getNodeParameter('priority', i) as string;
						if (priority) body.priority = priority;

						const list_interactionid = this.getNodeParameter('list_interactionid', i) as string[];
						if (list_interactionid) body.list_interactionid = list_interactionid;

						const ticketNotes = this.getNodeParameter('ticketNotes', i) as IDataObject;
						if (ticketNotes && ticketNotes.note) {
							body.ticketNotes = ticketNotes.note;
						}

						const ticketFileUploads = this.getNodeParameter('ticketFileUploads', i) as IDataObject;
						if (ticketFileUploads && ticketFileUploads.file) {
							body.ticketFileUploads = ticketFileUploads.file;
						}

						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const res = await icApiRequest.call(
							this,
							'POST',
							token,
							icUrl,
							'idstore',
							'api/ticket/create',
							body,
						);
						// check status code
						if (res.statusCode !== 200) {
							throw new NodeApiError(
								this.getNode(),
								res.body?.message || 'Unknown error occurred!',
							);
						}

						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(res.body?.data as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'update') {
						// ----------------------------------------
						//             ticket: update
						// ----------------------------------------
						const body = {} as IDataObject;

						body.id = this.getNodeParameter('id', i) as string;
						body.ticket_no = this.getNodeParameter('ticket_no', i) as string;

						const title = this.getNodeParameter('title', i) as string;
						if (title) body.title = title;

						const channel_type = this.getNodeParameter('channel_type', i) as string;
						if (channel_type) body.channel_type = channel_type;

						const customer_id = this.getNodeParameter('customer_id', i) as string;
						if (customer_id) body.customer_id = customer_id;

						const content = this.getNodeParameter('content', i) as string;
						if (content) body.content = content;

						const status = this.getNodeParameter('status', i) as string;
						if (status) body.status = status;

						const assign_to = this.getNodeParameter('assign_to', i) as string;
						if (assign_to) body.assign_to = assign_to;

						const priority = this.getNodeParameter('priority', i) as string;
						if (priority) body.priority = priority;

						const list_interactionid = this.getNodeParameter('list_interactionid', i) as string[];
						if (list_interactionid) body.list_interactionid = list_interactionid;

						const ticketNotes = this.getNodeParameter('ticketNotes', i) as IDataObject;
						if (ticketNotes && ticketNotes.note) {
							body.ticketNotes = ticketNotes.note;
						}

						const ticketFileUploads = this.getNodeParameter('ticketFileUploads', i) as IDataObject;
						if (ticketFileUploads && ticketFileUploads.file) {
							body.ticketFileUploads = ticketFileUploads.file;
						}

						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const res = await icApiRequest.call(
							this,
							'POST',
							token,
							icUrl,
							'idstore',
							'api/ticket/update',
							body,
						);
						// check status code
						if (res.statusCode !== 200) {
							throw new NodeApiError(
								this.getNode(),
								res.body?.message || 'Unknown error occurred!',
							);
						}

						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(res.body?.data as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'delete') {
						// ----------------------------------------
						//             ticket: delete
						// ----------------------------------------
						const body = {} as IDataObject;

						body.item = this.getNodeParameter('id', i) as string;

						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const res = await icApiRequest.call(
							this,
							'POST',
							token,
							icUrl,
							'idstore',
							'api/ticket/delete',
							body,
						);
						// check status code
						if (res.statusCode !== 200) {
							throw new NodeApiError(
								this.getNode(),
								res.body?.message || 'Unknown error occurred!',
							);
						}

						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(res.body?.data as IDataObject[]),
							{ itemData: { item: i } },
						);
					} else if (operation === 'check') {
						// ----------------------------------------
						//             ticket: check
						// ----------------------------------------
						const body = {} as IDataObject;

						body.interaction_id = this.getNodeParameter('interaction_id', i) as string;
						const tenant_id = this.getNodeParameter('tenant_id', i) as string;
						if (tenant_id) body.tenant_id = tenant_id;

						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const res = await icApiRequest.call(
							this,
							'POST',
							token,
							icUrl,
							'idstore',
							'api/ticket/check-ticket',
							body,
						);
						// check status code
						if (res.statusCode !== 200) {
							throw new NodeApiError(
								this.getNode(),
								res.body?.message || 'Unknown error occurred!',
							);
						}

						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(res.body?.data as IDataObject[]),
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
