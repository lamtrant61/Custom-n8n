/* eslint-disable n8n-nodes-base/cred-class-field-documentation-url-missing */
import type { ICredentialType, INodeProperties } from 'n8n-workflow';

const scopes = [
	'https://www.googleapis.com/auth/chat.spaces',
	'https://www.googleapis.com/auth/chat.messages',
	'https://www.googleapis.com/auth/chat.memberships',
];

export class IC2OAuth2Api implements ICredentialType {
	name = 'ic2OAuth2Api';
	extends = ['googleOAuth2Api']; // Bắt buộc để n8n biết đây là OAuth2
	displayName = 'IC OAuth2 API 2';
	properties: INodeProperties[] = [
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: scopes.join(' '),
		},
	];
}
