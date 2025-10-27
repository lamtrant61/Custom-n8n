/* eslint-disable n8n-nodes-base/cred-class-field-documentation-url-missing */
import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ICOAuth2Api implements ICredentialType {
	name = 'icOAuth2Api';
	extends = ['oAuth2Api']; // Bắt buộc để n8n biết đây là OAuth2
	displayName = 'IC OAuth2 API';
	properties: INodeProperties[] = [
		{
			displayName: 'OAuth2 Redirect URL',
			name: 'oauth2RedirectUrl',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	// authenticate = {
	// 	type: 'oAuth2',
	// 	properties: {
	// 		tokenUrl: 'https://api.mychat.com/oauth/token',
	// 		authorizationUrl: 'https://api.mychat.com/oauth/authorize',
	// 		authQueryParameters: {
	// 			access_type: 'offline',
	// 		},
	// 	},
	// };
}
