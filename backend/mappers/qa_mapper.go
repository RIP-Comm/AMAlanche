package mappers

import (
	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/RIP-Comm/AMAlanche/models/entity"
)

func MapQaCreateDTOToEntity(dto dto.QaCreateRequest) entity.Qa {
	return entity.Qa{
		Question: dto.Question,
		ParentId: dto.ParentId,
	}
}

func MapQaEntityToDto(entity entity.Qa) dto.QaResponse {
	children := []dto.QaResponse{}
	for _, qa := range entity.Children {
		channelResponse := MapQaEntityToDto(qa)
		children = append(children, channelResponse)
	}

	return dto.QaResponse{
		Id:        entity.ID,
		ChannelId: entity.ChannelId,
		OwnerId:   entity.User.ID,
		Username:  entity.User.Username,
		Question:  entity.Question,
		Children:  children,
	}
}
