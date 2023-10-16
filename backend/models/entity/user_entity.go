package entity

import "github.com/jinzhu/gorm"

type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique"`
	Password string `json:"password"`
	Email    string `json:"email" gorm:"unique"`
	Role     string `json:"role"`
}
