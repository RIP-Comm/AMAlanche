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

type ChannelController struct{}

// CreateChannel
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
// @Router /users/{userId}/channels [post]
func (uc *ChannelController) CreateChannel() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdStr := c.Param("userId")

		userId, err := utils.StrToUint(userIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.UserIdNotFoundMessage})
			return
		}

		authenticatedUser := c.MustGet("authenticatedUser").(*entity.User)

		if authenticatedUser.ID != userId {
			c.JSON(http.StatusForbidden, dto.ErrorResponse{Error: ex.ForbiddenMessage})
			return
		}

		var requestBody dto.ChannelCreateRequest

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.BadRequestInvalidJsonMessage})
			return
		}

		channel, customError := services.CreateChannel(userId, requestBody)
		if customError != &ex.NoError {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: customError.Message})
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

// GetById
// @Tags Channels
// @Summary Get channel by ID
// @Description Retrieves the details of a channel by its ID for the authenticated user.
// @Accept json
// @Produce json
// @Param userId path int true "ID of the authenticated user"
// @Param channelId path int true "ID of the channel to retrieve"
// @Success 200 {object} dto.ChannelResponse "Channel details retrieved successfully"
// @Failure 400 {object} dto.ErrorResponse "Bad request, user or channel ID is invalid"
// @Failure 403 {object} dto.ErrorResponse "Forbidden access, user is not allowed to access this channel"
// @Failure 404 {object} dto.ErrorResponse "Channel not found"
// @Failure 500 {object} dto.ErrorResponse "Internal Server Error"
// @Router /users/{userId}/channels/{channelId} [get]
func (uc *ChannelController) GetById() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdStr := c.Param("userId")

		userId, err := utils.StrToUint(userIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.UserIdNotFoundMessage})
			return
		}

		authenticatedUser := c.MustGet("authenticatedUser").(*entity.User)

		if authenticatedUser.ID != userId {
			c.JSON(http.StatusForbidden, dto.ErrorResponse{Error: ex.ForbiddenMessage})
			return
		}

		channelIdStr := c.Param("channelId")
		channelId, err := utils.StrToUint(channelIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.ChannelIdNotFoundMessage})
			return
		}

		channels, customError := services.GetChannelById(channelId)
		if customError != &ex.NoError {
			if customError == &ex.ChannelNotFound {
				c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: customError.Message})
			} else {
				c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: customError.Message})
			}
			return
		}

		response := mappers.MapChannelEntityEagerToChannelResponseDTO(*channels)
		c.JSON(
			http.StatusOK,
			response,
		)
	}
}

// GetAll
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
func (uc *ChannelController) GetAll() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdStr := c.Param("userId")

		userId, err := utils.StrToUint(userIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.UserIdNotFoundMessage})
			return
		}

		authenticatedUser := c.MustGet("authenticatedUser").(*entity.User)

		if authenticatedUser.ID != userId {
			c.JSON(http.StatusForbidden, dto.ErrorResponse{Error: ex.ForbiddenMessage})
			return
		}

		channels, customError := services.GetAllChannelByUserId(userId, 0)
		if customError != &ex.NoError {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: customError.Message})
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

// GetAllOwned
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
func (uc *ChannelController) GetAllOwned() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdStr := c.Param("userId")

		userId, err := utils.StrToUint(userIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.UserIdNotFoundMessage})
			return
		}

		authenticatedUser := c.MustGet("authenticatedUser").(*entity.User)

		if authenticatedUser.ID != userId {
			c.JSON(http.StatusForbidden, dto.ErrorResponse{Error: ex.ForbiddenMessage})
			return
		}

		channels, customError := services.GetAllChannelByUserId(userId, 2)
		if customError != &ex.NoError {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: customError.Message})
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

// GetAllMember
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
func (uc *ChannelController) GetAllMember() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdStr := c.Param("userId")

		userId, err := utils.StrToUint(userIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.UserIdNotFoundMessage})
			return
		}

		authenticatedUser := c.MustGet("authenticatedUser").(*entity.User)

		if authenticatedUser.ID != userId {
			c.JSON(http.StatusForbidden, dto.ErrorResponse{Error: ex.ForbiddenMessage})
			return
		}

		channels, customError := services.GetAllChannelByUserId(userId, 1)
		if customError != &ex.NoError {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: customError.Message})
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

// Join
// @Tags Channels
// @Summary User joins a channel
// @Description Join a channel with the provided channel ID as a user.
// @Accept json
// @Produce json
// @Param userId path int true "ID of the user attempting to join the channel"
// @Param channelId path int true "ID of the channel to join"
// @Success 200 {object} dto.ChannelResponse "User successfully joined the channel"
// @Failure 400 {object} dto.ErrorResponse "Bad request, invalid user or channel ID"
// @Failure 403 {object} dto.ErrorResponse "Forbidden access, user trying to join a channel with different user ID"
// @Failure 404 {object} dto.ErrorResponse "Channel not found"
// @Failure 500 {object} dto.ErrorResponse "Internal Server Error"
// @Router /users/{userId}/channels/{channelId}/join [post]
func (uc *ChannelController) Join() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIdStr := c.Param("userId")

		userId, err := utils.StrToUint(userIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.UserIdNotFoundMessage})
			return
		}

		authenticatedUser := c.MustGet("authenticatedUser").(*entity.User)

		if authenticatedUser.ID != userId {
			c.JSON(http.StatusForbidden, dto.ErrorResponse{Error: ex.ForbiddenMessage})
			return
		}

		channelIdStr := c.Param("channelId")
		channelId, err := utils.StrToUint(channelIdStr)
		if userIdStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.ChannelIdNotFoundMessage})
			return
		}

		channel, customError := services.JoinChannel(*authenticatedUser, channelId)
		if customError != &ex.NoError {
			if customError == &ex.ChannelNotFound {
				c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: customError.Message})
			} else {
				c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: customError.Message})
			}
			return
		}

		response := mappers.MapChannelEntityEagerToChannelResponseDTO(*channel)
		c.JSON(
			http.StatusOK,
			response,
		)
	}
}
