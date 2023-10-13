package dto

type AuthGoogleLoginRequest struct {
	Code string `json:"code" binding:"required"`
}

type AuthGoogleRefreshRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}
