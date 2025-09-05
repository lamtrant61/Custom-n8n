import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class BearerAuthApi implements ICredentialType {
	name = 'bearerAuthApi';
	displayName = 'Bearer Auth API';
	documentationUrl = 'bearerAuth';
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			// eslint-disable-next-line n8n-nodes-base/cred-class-field-type-options-password-missing
			typeOptions: {
				password: false,
			},
			default: '',
			placeholder: 'Bearer Token',
			description: 'Bearer token used to authenticate',
		},
	];
}
