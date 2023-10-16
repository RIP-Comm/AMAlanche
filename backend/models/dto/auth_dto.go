package dto

import "time"

// requests
type AuthGoogleLoginRequest struct {
	Code string `json:"code" binding:"required"`
}

type AuthGoogleRefreshRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}

type AuthInternalLoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// responses
type AuthGoogleTokenResponse struct {
	UserId       *uint     `json:"userId"`
	AccessToken  string    `json:"accessToken"`
	RefreshToken string    `json:"refreshToken"`
	Expiry       time.Time `json:"expiry"`
}

type AuthInternalLoginResponse struct {
	UserId      *uint     `json:"userId"`
	AccessToken string    `json:"accessToken"`
	Expiry      time.Time `json:"expiry"`
}
