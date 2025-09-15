import type { INodeProperties } from 'n8n-workflow';

export const interactionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['interaction'],
			},
		},
		options: [
			{
				name: 'Get By ID',
				value: 'getById',
				action: 'Get interaction by ID',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update interaction',
			},
			{
				name: 'Get List Detail',
				value: 'getListDetail',
				action: 'Get list interaction detail',
			},
			{
				name: 'Add Tag',
				value: 'addTag',
				action: 'Add tag interaction',
			},
		],
		default: 'getById',
	},
];

export const interactionFields: INodeProperties[] = [
	// ----------------------------------------
	//             interaction: getById
	// ----------------------------------------
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['getById'],
			},
		},
		description: 'Get interaction by ID',
	},

	// ----------------------------------------
	//             interaction: update
	// ----------------------------------------
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['update'],
			},
		},
		description: 'Update interaction',
	},
	{
		displayName: 'Customer ID',
		name: 'customer_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['update'],
			},
		},
		description: 'Update interaction',
	},
	{
		displayName: 'User Social ID',
		name: 'user_social_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['update'],
			},
		},
		description: 'Update interaction',
	},
	{
		displayName: 'Page Social ID',
		name: 'page_social_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['update'],
			},
		},
		description: 'Update interaction',
	},
	{
		displayName: 'Channel Type',
		name: 'channel_type',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['update'],
			},
		},
		description: 'Update interaction',
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['update'],
			},
		},
		description: 'Update interaction',
	},
	{
		displayName: 'App ID',
		name: 'app_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['update'],
			},
		},
		description: 'Update interaction',
	},
	{
		displayName: 'Source Address',
		name: 'source_address',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['update'],
			},
		},
		description: 'Update interaction',
	},
	{
		displayName: 'Is Active',
		name: 'is_active',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Tenant ID',
		name: 'tenant_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['update'],
			},
		},
		description: 'Update interaction',
	},

	// ----------------------------------------
	//             interaction: getListDetail
	// ----------------------------------------
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['getListDetail'],
			},
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		description: 'Page number to retrieve',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['getListDetail'],
			},
		},
	},
	{
		displayName: 'Interaction ID',
		name: 'interaction_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['getListDetail'],
			},
		},
		description: 'Get interaction list',
	},
	{
		displayName: 'User Social ID',
		name: 'user_social_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['getListDetail'],
			},
		},
		description: 'Get interaction list',
	},
	{
		displayName: 'Is All',
		name: 'is_all',
		type: 'boolean',
		required: true,
		default: true,
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['getListDetail'],
			},
		},
	},
	{
		displayName: 'Search Text',
		name: 'search_text',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['getListDetail'],
			},
		},
	},

	// ----------------------------------------
	//             interaction: addTag
	// ----------------------------------------
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['addTag'],
			},
		},
		description: 'Add tag for interaction',
	},
	{
		displayName: 'Interaction ID',
		name: 'interaction_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['addTag'],
			},
		},
		description: 'Add tag for interaction',
	},
	{
		displayName: 'Interactiondetail ID',
		name: 'interactiondetail_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['addTag'],
			},
		},
		description: 'Add tag for interaction',
	},
	{
		displayName: 'Customer ID',
		name: 'customer_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['addTag'],
			},
		},
		description: 'Add tag for interaction',
	},
	{
		displayName: 'Ticket ID',
		name: 'ticket_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['addTag'],
			},
		},
		description: 'Add tag for interaction',
	},
];
