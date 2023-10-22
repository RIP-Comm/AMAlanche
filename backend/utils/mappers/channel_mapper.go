package mappers

import (
	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/RIP-Comm/AMAlanche/models/entity"
)

func MapChannelCreateDTOToEntity(dto dto.ChannelCreateRequest) entity.Channel {
	return entity.Channel{
		Name: dto.Name,
	}
}

func MapChannelEntityToChannelResponseDTO(entity entity.Channel) dto.ChannelResponse {
	return dto.ChannelResponse{
		Id:      entity.ID,
		Name:    entity.Name,
		OwnerId: entity.OwnerId,
	}
}
