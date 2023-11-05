package services

import (
	"fmt"

	"github.com/RIP-Comm/AMAlanche/mappers"

	"github.com/RIP-Comm/AMAlanche/configs"
	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/RIP-Comm/AMAlanche/models/entity"
	"github.com/RIP-Comm/AMAlanche/utils/ex"
)

// create a new record
func CreateQA(user entity.User, channelId uint, qaDto dto.QaCreateRequest) (*entity.Qa, *ex.CustomError) {
	db := configs.GetDBInstance().DB

	channel, customError := GetChannelById(channelId)
	if customError != &ex.NoError {
		return nil, customError
	}

	exists := false

	for _, member := range channel.Members {
		if member.ID == user.ID {
			exists = true
		}
	}

	if !exists {
		return nil, &ex.CustomError{
			Code:    ex.ForbiddenCode,
			Message: ex.ForbiddenMessage,
		}
	}

	// create entity
	qaEntity := mappers.MapQaCreateDTOToEntity(qaDto)
	qaEntity.ChannelId = channelId
	qaEntity.OwnerId = user.ID
	qaEntity.User = user

	if err := db.Save(&qaEntity).Error; err != nil {
		return nil, &ex.CustomError{
			Code:    ex.GenericCode,
			Message: fmt.Sprintf(ex.GenericErrorMessage, err),
		}
	}

	return &qaEntity, &ex.NoError
}
