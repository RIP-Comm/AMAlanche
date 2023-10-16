package mappers

import (
	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/RIP-Comm/AMAlanche/models/entity"
)

func MapUserDTOToEntity(dto dto.UserUpdateRequest, entity *entity.User) {
	entity.Username = dto.Username
}
