package services

import (
	"errors"
	"fmt"

	"github.com/RIP-Comm/AMAlanche/configs"
	"github.com/RIP-Comm/AMAlanche/models/entity"
	"github.com/RIP-Comm/AMAlanche/utils"
	"github.com/jinzhu/gorm"
)

func GetUserById(id string) (entity.User, error) {
	db := configs.GetDBInstance().DB
	var user entity.User
	if err := db.First(&user, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return user, utils.UserNotFound
		} else {
			return user, fmt.Errorf(utils.GenericErrorMessage, err)
		}
	}
	return user, nil
}

func GetUserByEmail(email string) (entity.User, error) {
	db := configs.GetDBInstance().DB
	var user entity.User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return user, utils.UserNotFound
		} else {
			return user, fmt.Errorf(utils.GenericErrorMessage, err)
		}
	}
	return user, nil
}

func CreateUser(user entity.User) (entity.User, error) {
	db := configs.GetDBInstance().DB
	if err := db.Create(&user).Error; err != nil {
		return user, fmt.Errorf(utils.GenericErrorMessage, err)
	}

	return user, nil
}
