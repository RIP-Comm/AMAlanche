export const axiosCommonResponseInterceptor = (response: any) => response;

export const axiosCommonErrorInterceptor = (error: any) => {
	console.error('An error occurred during the request:', error);
	return Promise.reject(error);
};
