package services

import (
	"errors"
	"fmt"

	"github.com/RIP-Comm/AMAlanche/mappers"

	"github.com/RIP-Comm/AMAlanche/utils/ex"
	"github.com/lib/pq"

	"github.com/RIP-Comm/AMAlanche/models/dto"

	"github.com/RIP-Comm/AMAlanche/configs"
	"github.com/RIP-Comm/AMAlanche/models/entity"
	"github.com/jinzhu/gorm"
)

func GetUserById(id uint) (*entity.User, *ex.CustomError) {
	db := configs.GetDBInstance().DB

	var user entity.User
	if err := db.First(&user, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &ex.UserNotFound
		} else {
			return nil, &ex.CustomError{
				Code:    ex.GenericCode,
				Message: fmt.Sprintf(ex.GenericErrorMessage, err),
			}
		}
	}
	return &user, &ex.NoError
}

func GetUserByUsername(username string) (*entity.User, *ex.CustomError) {
	db := configs.GetDBInstance().DB
	var user entity.User
	if err := db.Where("username = ?", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &ex.UserNotFound
		} else {
			return nil, &ex.CustomError{
				Code:    ex.GenericCode,
				Message: fmt.Sprintf(ex.GenericErrorMessage, err),
			}
		}
	}
	return &user, &ex.NoError
}

func GetUserByEmail(email string) (*entity.User, *ex.CustomError) {
	db := configs.GetDBInstance().DB
	var user entity.User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &ex.UserNotFound
		} else {
			return nil, &ex.CustomError{
				Code:    ex.GenericCode,
				Message: fmt.Sprintf(ex.GenericErrorMessage, err),
			}
		}
	}
	return &user, &ex.NoError
}

// create a new record
func CreateUser(user entity.User) (*entity.User, *ex.CustomError) {
	db := configs.GetDBInstance().DB
	if err := db.Create(&user).Error; err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) && pqErr.Code == "23505" {
			return nil, &ex.CustomError{
				Code:    ex.ConflictCode,
				Message: pqErr.Detail,
			}
		} else {
			return nil, &ex.CustomError{
				Code:    ex.GenericCode,
				Message: fmt.Sprintf(ex.GenericErrorMessage, err),
			}
		}
	}

	return &user, &ex.NoError
}

// updates an existing record
func saveUser(userDto dto.UserUpdateRequest, user *entity.User) *ex.CustomError {
	db := configs.GetDBInstance().DB
	mappers.MapUserUpdateDTOToEntity(userDto, user)
	if err := db.Save(&user).Error; err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) && pqErr.Code == "23505" {
			return &ex.CustomError{
				Code:    ex.ConflictCode,
				Message: pqErr.Detail,
			}
		}
		return &ex.CustomError{
			Code:    ex.GenericCode,
			Message: fmt.Sprintf(ex.GenericErrorMessage, err),
		}

	}
	return &ex.NoError
}

func UpdateUser(id uint, userDto dto.UserUpdateRequest) (*entity.User, *ex.CustomError) {
	user, customError := GetUserById(id)
	if customError != &ex.NoError {
		return user, customError
	}

	customError = saveUser(userDto, user)
	if customError != &ex.NoError {
		return user, customError
	}

	return user, &ex.NoError
}

func GetFirstValidUsername(username *string) ex.CustomError {
	initialUsername := *username
	progressive := 0
	for {
		_, customError := GetUserByUsername(*username)
		if customError != &ex.NoError {
			if customError == &ex.UserNotFound {
				break
			} else {
				return ex.CustomError{
					Code:    ex.GenericCode,
					Message: ex.GenericErrorMessage,
				}
			}
		}

		progressive++
		*username = fmt.Sprintf("%s%d", initialUsername, progressive)
	}

	return ex.NoError
}

func userAddChannel(channel *entity.Channel, user *entity.User) *ex.CustomError {
	db := configs.GetDBInstance().DB

	user.Channels = append([]entity.Channel{*channel}, user.Channels...)

	if err := db.Save(&user).Error; err != nil {
		return &ex.CustomError{
			Code:    ex.GenericCode,
			Message: fmt.Sprintf(ex.GenericErrorMessage, err),
		}
	}

	// update channel id
	channelId := user.Channels[len(user.Channels)-1].ID
	channel.ID = channelId

	return &ex.NoError
}
