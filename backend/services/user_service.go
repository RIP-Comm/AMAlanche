package services

import (
	"github.com/RIP-Comm/AMAlanche/configs"
	"github.com/RIP-Comm/AMAlanche/models/entity"
)

func CreateUser(username string, hashedPassword []byte, role string, email string) (entity.UserEntity, error) {
	user := entity.UserEntity{
		Username: username,
		Password: string(hashedPassword),
		Email:    email,
		Role:     role,
	}
	dbInstance := configs.GetDBInstance()
	return user, dbInstance.DB.Create(user).Error

}

func GetUser(username string, user *entity.UserEntity) {
	dbInstance := configs.GetDBInstance()
	dbInstance.DB.Table("user_entities").Where("username = ?", username).Scan(&user)
}
