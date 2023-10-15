export interface User {
	id: number;
	username: string;
	email: string;
}

export interface UpdateUserRequest {
	id: number;
	username: string;
}
