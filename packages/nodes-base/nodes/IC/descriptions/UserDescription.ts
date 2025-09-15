import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get By Username',
				value: 'getByUsername',
				action: 'Get user by ID',
			},
			{
				name: 'Get List',
				value: 'getList',
				action: 'Get list users',
			},
		],
		default: 'getByUsername',
	},
];

export const userFields: INodeProperties[] = [
	// ----------------------------------------
	//             user: getByUsername
	// ----------------------------------------
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getByUsername'],
			},
		},
		description: 'Get user by username',
	},

	// ----------------------------------------
	//             user: getList
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
				resource: ['user'],
				operation: ['getList'],
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
				resource: ['user'],
				operation: ['getList'],
			},
		},
	},
	// {
	// 	displayName: 'Sort',
	// 	name: 'sort',
	// 	type: 'collection',
	// 	placeholder: 'Add Sort',
	// 	default: {},
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['user'],
	// 			operation: ['getList'],
	// 		},
	// 	},
	// 	options: [
	// 		{
	// 			displayName: 'Name Field',
	// 			name: 'nameField',
	// 			type: 'string',
	// 			default: '',
	// 			description: 'Field name to sort by',
	// 		},
	// 		{
	// 			displayName: 'Sort Type',
	// 			name: 'sortType',
	// 			type: 'options',
	// 			options: [
	// 				{
	// 					name: 'ASC',
	// 					value: 'ASC',
	// 				},
	// 				{
	// 					name: 'DESC',
	// 					value: 'DESC',
	// 				},
	// 			],
	// 			default: 'ASC',
	// 		},
	// 	],
	// },
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Sort',
		default: [
			{
				sort: {
					name_field: '',
					type_sort: 'ASC',
				},
			},
		],
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getList'],
			},
		},
		options: [
			{
				displayName: 'Sort',
				name: 'sort',
				values: [
					{
						displayName: 'Name Field',
						name: 'name_field',
						type: 'string',
						default: '',
						description: 'Field name to search',
					},
					{
						displayName: 'Sort Type',
						name: 'type_sort',
						type: 'options',
						options: [
							{
								name: 'ASC',
								value: 'ASC',
							},
							{
								name: 'DESC',
								value: 'DESC',
							},
						],
						default: 'ASC',
					},
				],
			},
		],
	},
	{
		displayName: 'Search List',
		name: 'search_list',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true, // Cho phép thêm nhiều item
		},
		placeholder: 'Add Search List',
		default: [
			{
				search: {
					name_field: '',
					value_search: '',
				},
			},
		],
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getList'],
			},
		},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				values: [
					{
						displayName: 'Name Field',
						name: 'name_field',
						type: 'string',
						default: '',
						description: 'Field name to search',
					},
					{
						displayName: 'Value Search',
						name: 'value_search',
						type: 'string',
						default: '',
						description: 'Value to search',
					},
				],
			},
		],
	},
];
