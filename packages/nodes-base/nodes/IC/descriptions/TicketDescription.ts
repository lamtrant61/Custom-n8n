import type { INodeProperties } from 'n8n-workflow';

const listInfoTicket = (option: string) => {
	return [
		{
			displayName: 'Title',
			name: 'title',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['ticket'],
					operation: [option],
				},
			},
			description: `${option} ticket`,
		},
		{
			displayName: 'Channel Type',
			name: 'channel_type',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['ticket'],
					operation: [option],
				},
			},
			description: `${option} ticket`,
		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'string',
			default: 'new',
			displayOptions: {
				show: {
					resource: ['ticket'],
					operation: [option],
				},
			},
			description: `${option} ticket`,
		},
		{
			displayName: 'Customer ID',
			name: 'customer_id',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['ticket'],
					operation: [option],
				},
			},
			description: `${option} ticket`,
		},
		{
			displayName: 'Content',
			name: 'content',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['ticket'],
					operation: [option],
				},
			},
			description: `${option} ticket`,
		},
		{
			displayName: 'Assign To',
			name: 'assign_to',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['ticket'],
					operation: [option],
				},
			},
			description: `${option} ticket`,
		},
		{
			displayName: 'Priority',
			name: 'priority',
			type: 'options',
			default: 'middle',
			displayOptions: {
				show: {
					resource: ['ticket'],
					operation: [option],
				},
			},
			options: [
				{
					name: 'High',
					value: 'high',
				},
				{
					name: 'Middle',
					value: 'middle',
				},
				{
					name: 'Low',
					value: 'low',
				},
			],
		},
		{
			displayName: 'List Interactionid',
			name: 'list_interactionid',
			type: 'string',
			typeOptions: {
				multipleValues: true,
			},
			default: [],
			placeholder: 'Nhập nhiều Interaction ID',
			displayOptions: {
				show: {
					resource: ['ticket'],
					operation: [option],
				},
			},
			description: 'Nhập nhiều Interaction ID (mỗi ID một dòng)',
		},
		{
			displayName: 'Ticket Notes',
			name: 'ticketNotes',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true, // Cho phép thêm nhiều item
			},
			placeholder: 'Add Ticket Notes',
			default: [
				{
					note: {
						note_content: '',
						location_long: '',
						location_lat: '',
						note_type: 'text',
						note_source: '',
					},
				},
			],
			displayOptions: {
				show: {
					resource: ['ticket'],
					operation: [option],
				},
			},
			options: [
				{
					displayName: 'Note',
					name: 'note',
					values: [
						{
							displayName: 'Note Content',
							name: 'note_content',
							type: 'string',
							default: '',
							description: 'Note Content to create',
						},
						{
							displayName: 'Location Long',
							name: 'location_long',
							type: 'string',
							default: '',
							description: 'Location to create',
						},
						{
							displayName: 'Location Lat',
							name: 'location_lat',
							type: 'string',
							default: '',
							description: 'Location to create',
						},
						{
							displayName: 'Note Type',
							name: 'note_type',
							type: 'string',
							default: 'text',
							description: 'Note type to create',
						},
						{
							displayName: 'Note Source',
							name: 'note_source',
							type: 'string',
							default: '',
							description: 'Note Source to create',
						},
					],
				},
			],
		},
		{
			displayName: 'Ticket File Uploads',
			name: 'ticketFileUploads',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true, // Cho phép thêm nhiều item
			},
			placeholder: 'Add Ticket File Uploads',
			default: [
				{
					file: {
						file_name: '',
						file_url: '',
						extension: '',
						file_size: '',
						download_url: '',
						file_note_content: '',
					},
				},
			],
			displayOptions: {
				show: {
					resource: ['ticket'],
					operation: [option],
				},
			},
			options: [
				{
					displayName: 'File',
					name: 'file',
					values: [
						{
							displayName: 'File Name',
							name: 'file_name',
							type: 'string',
							default: '',
							description: `File to ${option}`,
						},
						{
							displayName: 'File URL',
							name: 'file_url',
							type: 'string',
							default: '',
							description: `File to ${option}`,
						},
						{
							displayName: 'Extension',
							name: 'extension',
							type: 'string',
							default: '',
							description: `File to ${option}`,
						},
						{
							displayName: 'File Size',
							name: 'file_size',
							type: 'string',
							default: '',
							description: `File to ${option}`,
						},
						{
							displayName: 'Download URL',
							name: 'download_url',
							type: 'string',
							default: '',
							description: `File to ${option}`,
						},
						{
							displayName: 'File Note Content',
							name: 'file_note_content',
							type: 'string',
							default: '',
							description: `File to ${option}`,
						},
					],
				},
			],
		},
	] as INodeProperties[];
};

export const ticketOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create ticket',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update ticket',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete ticket',
			},
			{
				name: 'Check Ticket',
				value: 'check',
				action: 'Check ticket',
			},
		],
		default: 'create',
	},
];

export const ticketFields: INodeProperties[] = [
	// ----------------------------------------
	//             ticket: create
	// ----------------------------------------
	...listInfoTicket('create'),

	// ----------------------------------------
	//             ticket: update
	// ----------------------------------------
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['update'],
			},
		},
		description: 'Update ticket',
	},
	{
		displayName: 'Ticket No',
		name: 'ticket_no',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['update'],
			},
		},
		description: 'Update ticket',
	},
	...listInfoTicket('update'),

	// ----------------------------------------
	//             ticket: delete
	// ----------------------------------------
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['delete'],
			},
		},
		description: 'Delete ticket',
	},

	// ----------------------------------------
	//             ticket: check ticket
	// ----------------------------------------
	{
		displayName: 'Interaction ID',
		name: 'interaction_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['check'],
			},
		},
		description: 'Check ticket',
	},
	{
		displayName: 'Tenant ID',
		name: 'tenant_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['check'],
			},
		},
		description: 'Check ticket',
	},
];
