package dto

// requests
type UserCreateRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required"`
}

type UserUpdateRequest struct {
	Username string `json:"username" binding:"required"`
}

// responeses
type UserResponse struct {
	Id       uint   `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}
