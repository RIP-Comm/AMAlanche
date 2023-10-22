package controllers

import (
	"net/http"

	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/RIP-Comm/AMAlanche/services"
	"github.com/RIP-Comm/AMAlanche/utils"
	"github.com/RIP-Comm/AMAlanche/utils/ex"
	"github.com/RIP-Comm/AMAlanche/utils/mappers"
	"github.com/gin-gonic/gin"
)

type UserChannelController struct{}

// @Tags Channels
// @Summary Create a channel
// @Description Create a new channel for a specific user.
// @Accept json
// @Produce json
// @Param userId path int true "ID of the user who owns the channel"
// @Param dto.channelCreateRequest body dto.ChannelCreateRequest true "Channel creation data"
// @Success 200 {object} dto.ChannelCreateResponse "Channel created successfully"
// @Failure 400 {object} dto.ErrorResponse "Bad request"
// @Failure 403 {object} dto.ErrorResponse "Forbidden access"
// @Failure 500 {object} dto.ErrorResponse "Internal server error"
// @Router /user/{userId}/channel [post]
func (uc *UserChannelController) CreateChannel() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdStr := c.Param("userId")

		userId, err := utils.StrToUint(userIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.UserIdNotFoundMessage})
			return
		}

		authenticatedUserId := c.MustGet("authenticatedUserId").(uint)

		if authenticatedUserId != userId {
			c.JSON(http.StatusForbidden, ex.ForbiddenMessage)
			return
		}

		var requestBody dto.ChannelCreateRequest

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.BadRequestInvalidJsonMessage})
			return
		}

		channel, customError := services.CreateChannel(userId, requestBody)
		if customError != &ex.NoError {
			c.JSON(http.StatusInternalServerError, customError.Message)
			return
		}

		c.JSON(
			http.StatusOK,
			dto.ChannelCreateResponse{
				Id:      channel.ID,
				Name:    channel.Name,
				OwnerId: channel.OwnerId,
			})
	}
}

// @Tags Channels
// @Summary Get channel by id
// @Description Retrieve a channel by its ID.
// @Accept json
// @Produce json
// @Param userId path int true "ID of the user"
// @Param channelId path int true "ID of the channel"
// @Success 200 {object} dto.ChannelResponse "Channel retrieved successfully"
// @Failure 400 {object} dto.ErrorResponse "Bad request"
// @Failure 403 {object} dto.ErrorResponse "Forbidden access"
// @Failure 404 {object} dto.ErrorResponse "Channel not found"
// @Failure 500 {object} dto.ErrorResponse "Internal server error"
// @Router /users/{userId}/channels/{channelId}  [get]
func (uc *UserChannelController) GetById() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdStr := c.Param("userId")

		userId, err := utils.StrToUint(userIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.UserIdNotFoundMessage})
			return
		}

		authenticatedUserId := c.MustGet("authenticatedUserId").(uint)

		if authenticatedUserId != userId {
			c.JSON(http.StatusForbidden, ex.ForbiddenMessage)
			return
		}

		channelIdStr := c.Param("channelId")
		channelId, err := utils.StrToUint(channelIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.ChannelIdNotFoundMessage})
			return
		}

		channels, customError := services.GetById(userId, channelId)
		if customError != &ex.NoError {
			if customError == &ex.ChannelNotFound {
				c.JSON(http.StatusNotFound, customError.Message)
			} else {
				c.JSON(http.StatusInternalServerError, customError.Message)
			}
			return
		}

		response := mappers.MapChannelEntityToChannelResponseDTO(*channels)
		c.JSON(
			http.StatusOK,
			response,
		)
	}
}

// @Tags Channels
// @Summary Get all channels for a user
// @Description Retrieve all channels associated with a specific user.
// @Accept json
// @Produce json
// @Param userId path int true "ID of the user"
// @Success 200 {object} []dto.ChannelResponse "Channels retrieved successfully"
// @Failure 400 {object} dto.ErrorResponse "Bad request"
// @Failure 403 {object} dto.ErrorResponse "Forbidden access"
// @Router /users/{userId}/channels/all  [get]
func (uc *UserChannelController) GetAll() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdStr := c.Param("userId")

		userId, err := utils.StrToUint(userIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.UserIdNotFoundMessage})
			return
		}

		authenticatedUserId := c.MustGet("authenticatedUserId").(uint)

		if authenticatedUserId != userId {
			c.JSON(http.StatusForbidden, ex.ForbiddenMessage)
			return
		}

		channels, customError := services.GetAllChannelByUserId(userId, 0)
		if customError != &ex.NoError {
			c.JSON(http.StatusInternalServerError, customError.Message)
			return
		}

		response := &[]dto.ChannelResponse{}
		for _, channel := range channels {
			channelResponse := mappers.MapChannelEntityToChannelResponseDTO(channel)
			*response = append(*response, channelResponse)
		}

		c.JSON(
			http.StatusOK,
			response,
		)
	}
}

// @Tags Channels
// @Summary Get all channels owned by a user
// @Description Retrieve all channels owned by a specific user.
// @Accept json
// @Produce json
// @Param userId path int true "ID of the user"
// @Success 200 {object} []dto.ChannelResponse "Owned channels retrieved successfully"
// @Failure 400 {object} dto.ErrorResponse "Bad request"
// @Failure 403 {object} dto.ErrorResponse "Forbidden access"
// @Failure 500 {object} dto.ErrorResponse "Internal server error"
// @Router /users/{userId}/channels/owned [get]
func (uc *UserChannelController) GetAllOwned() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdStr := c.Param("userId")

		userId, err := utils.StrToUint(userIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.UserIdNotFoundMessage})
			return
		}

		authenticatedUserId := c.MustGet("authenticatedUserId").(uint)

		if authenticatedUserId != userId {
			c.JSON(http.StatusForbidden, ex.ForbiddenMessage)
			return
		}

		channels, customError := services.GetAllChannelByUserId(userId, 2)
		if customError != &ex.NoError {
			c.JSON(http.StatusInternalServerError, customError.Message)
			return
		}

		response := &[]dto.ChannelResponse{}
		for _, channel := range channels {
			channelResponse := mappers.MapChannelEntityToChannelResponseDTO(channel)
			*response = append(*response, channelResponse)
		}

		c.JSON(
			http.StatusOK,
			response,
		)
	}
}

// @Tags Channels
// @Summary Get all channels visible for a user you don't own
// @Description Retrieve all visible channels, you don't own, associated with a specific user.
// @Accept json
// @Produce json
// @Param userId path int true "ID of the user"
// @Success 200 {object} []dto.ChannelResponse "Visible channels retrieved successfully"
// @Failure 400 {object} dto.ErrorResponse "Bad request"
// @Failure 403 {object} dto.ErrorResponse "Forbidden access"
// @Router /users/{userId}/channels/member [get]
func (uc *UserChannelController) GetAllMember() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdStr := c.Param("userId")

		userId, err := utils.StrToUint(userIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.UserIdNotFoundMessage})
			return
		}

		authenticatedUserId := c.MustGet("authenticatedUserId").(uint)

		if authenticatedUserId != userId {
			c.JSON(http.StatusForbidden, ex.ForbiddenMessage)
			return
		}

		channels, customError := services.GetAllChannelByUserId(userId, 1)
		if customError != &ex.NoError {
			c.JSON(http.StatusInternalServerError, customError.Message)
			return
		}

		response := &[]dto.ChannelResponse{}
		for _, channel := range channels {
			channelResponse := mappers.MapChannelEntityToChannelResponseDTO(channel)
			*response = append(*response, channelResponse)
		}

		c.JSON(
			http.StatusOK,
			response,
		)
	}
}
