export interface AuthGoogleLoginRequest {
	code: string;
}

export interface AuthGoogleRefreshRequest {
	refreshToken: string;
}

export interface AuthGoogleResponse {
	userId: string;
	accessToken: string;
	refreshToken: string;
	expiry: string;
}
