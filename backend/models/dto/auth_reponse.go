package dto

import "time"

type AuthGoogleTokenResponse struct {
	UserId       *uint     `json:"userId"`
	AccessToken  string    `json:"accessToken"`
	RefreshToken string    `json:"refreshToken"`
	Expiry       time.Time `json:"expiry"`
}
