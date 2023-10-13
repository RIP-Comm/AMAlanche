package entity

import "github.com/jinzhu/gorm"

type User struct {
	gorm.Model
	Username *string `json:"username"`
	Email    string  `json:"email"`
}
