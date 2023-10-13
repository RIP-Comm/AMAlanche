package dto

type UserResponse struct {
	Username *string `json:"username"`
	Email    string  `json:"email"`
}
