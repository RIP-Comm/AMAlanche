package services

import (
	"errors"
	"fmt"

	"github.com/jinzhu/gorm"

	"github.com/RIP-Comm/AMAlanche/configs"
	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/RIP-Comm/AMAlanche/models/entity"
	"github.com/RIP-Comm/AMAlanche/utils/ex"
	"github.com/RIP-Comm/AMAlanche/utils/mappers"
)

// create a new record
func CreateChannel(userId uint, channelDto dto.ChannelCreateRequest) (*entity.Channel, *ex.CustomError) {
	owner, customError := GetUserById(userId)
	if customError != &ex.NoError {
		return nil, customError
	}

	// create entity
	channelEntity := mappers.MapChannelCreateDTOToEntity(channelDto)
	channelEntity.OwnerId = owner.ID

	// add channel in user
	customError = userAddChannel(&channelEntity, &owner)
	if customError != &ex.NoError {
		return nil, customError
	}

	return &channelEntity, &ex.NoError
}

func GetById(userId uint, channelId uint) (*entity.Channel, *ex.CustomError) {
	db := configs.GetDBInstance().DB

	var channel entity.Channel
	if err := db.Table("users").
		Select("c.*").
		Joins("LEFT JOIN channel_members cp ON users.id = cp.user_id").
		Joins("LEFT JOIN channels c on c.id = cp.channel_id").
		Where("users.id = ? AND c.id = ?", userId, channelId).
		Find(&channel).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &ex.ChannelNotFound
		} else {
			return nil, &ex.CustomError{
				Code:    ex.GenericCode,
				Message: fmt.Sprintf(ex.GenericErrorMessage, err),
			}
		}
	}

	return &channel, &ex.NoError
}

func GetAllChannelByUserId(userId uint, visibilityType int) ([]entity.Channel, *ex.CustomError) {
	db := configs.GetDBInstance().DB

	extraQuery := ""
	if visibilityType == 1 {
		// only those in which I am member
		extraQuery = " AND c.owner_id != users.id"
	} else if visibilityType == 2 {
		// only those in which I own
		extraQuery = " AND c.owner_id = users.id"
	}

	var channels []entity.Channel
	err := db.Table("users").
		Select("c.*").
		Joins("LEFT JOIN channel_members cp ON users.id = cp.user_id").
		Joins("LEFT JOIN channels c on c.id = cp.channel_id").
		Where("users.id = ?"+extraQuery, userId).
		Find(&channels).Error
	if err != nil {
		return nil, &ex.CustomError{
			Code:    ex.GenericCode,
			Message: fmt.Sprintf(ex.GenericErrorMessage, err),
		}
	}

	return channels, &ex.NoError
}
