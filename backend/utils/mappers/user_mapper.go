package mappers

import (
	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/RIP-Comm/AMAlanche/models/entity"
)

func MapUserUpdateDTOToEntity(dto dto.UserUpdateRequest, entity *entity.User) {
	entity.Username = dto.Username
}

func MapUserEntityToUserResponse(entity entity.User) dto.UserResponse {
	return dto.UserResponse{
		Id:       entity.ID,
		Username: entity.Username,
		Email:    entity.Email,
	}
}
