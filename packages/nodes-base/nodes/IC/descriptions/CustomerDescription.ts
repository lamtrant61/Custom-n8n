import type { INodeProperties } from 'n8n-workflow';

export const customerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customer'],
			},
		},
		options: [
			{
				name: 'Get By ID',
				value: 'getById',
				action: 'Get customer by ID',
			},
			// {
			// 	name: 'Get By Social ID',
			// 	value: 'getBySocialId',
			// 	action: 'Get customer by social ID',
			// },
			{
				name: 'Update',
				value: 'update',
				action: 'Update customer',
			},
		],
		default: 'getById',
	},
];

export const customerFields: INodeProperties[] = [
	// ----------------------------------------
	//             customer: getById
	// ----------------------------------------
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getById'],
			},
		},
		description: 'Get customer by ID',
	},

	// ----------------------------------------
	//             customer: getBySocialId
	// ----------------------------------------
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getBySocialId'],
			},
		},
		description: 'Get customer by social ID',
	},

	// ----------------------------------------
	//             customer: update
	// ----------------------------------------
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['update'],
			},
		},
		description: 'Update customer by ID',
	},
	{
		displayName: 'Customer Name',
		name: 'customer_name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['update'],
			},
		},
		description: 'Update customer by ID',
	},
	// {
	// 	displayName: 'Gender',
	// 	name: 'gender',
	// 	type: 'options',
	// 	default: '',
	// 	options: [
	// 		{
	// 			name: 'Nam',
	// 			value: 'Nam',
	// 		},
	// 		{
	// 			name: 'Nữ',
	// 			value: 'Nữ',
	// 		},
	// 	],
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['customer'],
	// 			operation: ['update'],
	// 		},
	// 	},
	// 	description: 'Update customer by ID',
	// },
	{
		displayName: 'Date of Birth',
		name: 'birth_date',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['update'],
			},
		},
		description: 'Update customer by ID',
	},
	{
		displayName: 'Avatar',
		name: 'avatar',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['update'],
			},
		},
		description: 'Update customer by ID',
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['update'],
			},
		},
		description: 'Update customer by ID',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['update'],
			},
		},
		description: 'Update customer by ID',
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['update'],
			},
		},
		description: 'Update customer by ID',
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['update'],
			},
		},
		description: 'Update customer by ID',
	},
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['update'],
			},
		},
		description: 'Update customer by ID',
	},
	// {
	// 	displayName: 'User Social ID',
	// 	name: 'user_social_id',
	// 	type: 'string',
	// 	default: '',
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['customer'],
	// 			operation: ['update'],
	// 		},
	// 	},
	// 	description: 'Update customer by ID',
	// },
];
