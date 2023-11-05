package services

import (
	"errors"
	"fmt"

	"github.com/RIP-Comm/AMAlanche/mappers"

	"github.com/jinzhu/gorm"

	"github.com/RIP-Comm/AMAlanche/configs"
	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/RIP-Comm/AMAlanche/models/entity"
	"github.com/RIP-Comm/AMAlanche/utils/ex"
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
	customError = userAddChannel(&channelEntity, owner)
	if customError != &ex.NoError {
		return nil, customError
	}

	return &channelEntity, &ex.NoError
}

// update a record
func SaveChannel(channel *entity.Channel) (*entity.Channel, *ex.CustomError) {
	db := configs.GetDBInstance().DB
	if err := db.Save(&channel).Error; err != nil {
		return nil, &ex.CustomError{
			Code:    ex.GenericCode,
			Message: fmt.Sprintf(ex.GenericErrorMessage, err),
		}
	}
	return channel, &ex.NoError
}

func GetChannelById(channelId uint) (*entity.Channel, *ex.CustomError) {
	db := configs.GetDBInstance().DB

	var channel entity.Channel
	if err := db.
		Preload("Members").
		Preload("Qas", "parent_id IS NULL").
		Preload("Qas.User").
		Preload("Qas.Children").
		First(&channel, channelId).
		Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &ex.ChannelNotFound
		}
		return nil, &ex.CustomError{
			Code:    ex.GenericCode,
			Message: fmt.Sprintf(ex.GenericErrorMessage, err),
		}
	}

	if err := preloadQaChildren(db, &channel.Qas); err != &ex.NoError {
		return nil, &ex.CustomError{
			Code:    ex.GenericCode,
			Message: fmt.Sprintf(ex.GenericErrorMessage, err),
		}
	}

	return &channel, &ex.NoError
}

// preloadQaChildren is a recursive function that loads all Children of a slice of Qa.
func preloadQaChildren(db *gorm.DB, qas *[]entity.Qa) *ex.CustomError {
	var ids []uint
	for _, qa := range *qas {
		ids = append(ids, qa.ID)
	}

	if len(ids) == 0 {
		return &ex.NoError
	}

	var children []entity.Qa
	if err := db.
		Preload("User").
		Preload("Children").
		Where("parent_id IN (?)", ids).
		Find(&children).
		Error; err != nil {
		return &ex.CustomError{
			Code:    ex.GenericCode,
			Message: fmt.Sprintf(ex.GenericErrorMessage, err),
		}
	}

	childrenMap := make(map[uint][]entity.Qa)
	for _, child := range children {
		childrenMap[*child.ParentId] = append(childrenMap[*child.ParentId], child)
	}

	for i, qa := range *qas {
		if childQAs, ok := childrenMap[qa.ID]; ok {
			(*qas)[i].Children = childQAs

			if errorCustom := preloadQaChildren(db, &(*qas)[i].Children); errorCustom != &ex.NoError {
				return errorCustom
			}

		}
	}

	return &ex.NoError
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
		Find(&channels).
		Error
	if err != nil {
		return nil, &ex.CustomError{
			Code:    ex.GenericCode,
			Message: fmt.Sprintf(ex.GenericErrorMessage, err),
		}
	}

	return channels, &ex.NoError
}

func JoinChannel(user entity.User, channelId uint) (*entity.Channel, *ex.CustomError) {
	channel, customError := GetChannelById(channelId)
	if customError != &ex.NoError {
		return nil, customError
	}

	channel.Members = append(channel.Members, user)

	channel, customError = SaveChannel(channel)
	if customError != &ex.NoError {
		return nil, customError
	}

	return channel, &ex.NoError
}
