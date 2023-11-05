package controllers

import (
	"net/http"

	"github.com/RIP-Comm/AMAlanche/mappers"
	"github.com/RIP-Comm/AMAlanche/models/entity"

	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/RIP-Comm/AMAlanche/services"
	"github.com/RIP-Comm/AMAlanche/utils"
	"github.com/RIP-Comm/AMAlanche/utils/ex"
	"github.com/gin-gonic/gin"
)

type QaController struct{}

// @Tags QA
// @Summary Create a new Q&A entry
// @Description Create a new Q&A in the specified channel for the authenticated user.
// @Accept json
// @Produce json
// @Param userId path int true "ID of the user creating the Q&A"
// @Param channelId path int true "ID of the channel where the Q&A is being created"
// @Param requestBody body dto.QaCreateRequest true "Q&A creation data"
// @Success 200 {object} dto.QaResponse "Q&A created successfully"
// @Failure 400 {object} dto.ErrorResponse "Bad request, invalid JSON or missing parameters"
// @Failure 403 {object} dto.ErrorResponse "Forbidden access, user does not have permission"
// @Failure 500 {object} dto.ErrorResponse "Internal Server Error, could not create Q&A"
// @Router /channels/{channelId}/users/{userId}/qa [post]
func (uc *QaController) CreateQa() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdStr := c.Param("userId")
		channelIdStr := c.Param("channelId")

		channelId, err := utils.StrToUint(channelIdStr)
		if channelIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.ChannelIdNotFoundMessage})
			return
		}

		userId, err := utils.StrToUint(userIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.UserIdNotFoundMessage})
			return
		}

		authenticatedUser := c.MustGet("authenticatedUser").(*entity.User)

		if authenticatedUser.ID != userId {
			c.JSON(http.StatusForbidden, dto.ErrorResponse{ex.ForbiddenMessage})
			return
		}

		var requestBody dto.QaCreateRequest

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.BadRequestInvalidJsonMessage})
			return
		}

		qa, customError := services.CreateQA(*authenticatedUser, channelId, requestBody)
		if customError != &ex.NoError {
			if customError.Code == ex.ForbiddenCode {
				c.JSON(http.StatusForbidden, dto.ErrorResponse{Error: customError.Message})
			} else {
				c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: customError.Message})
			}
			return
		}

		response := mappers.MapQaEntityToDto(*qa)
		c.JSON(
			http.StatusOK,
			response,
		)
	}
}
