export interface User {
	id: string;
	username: string;
	email: string;
}

export interface UpdateUserRequest {
	id: string;
	username: string;
}
