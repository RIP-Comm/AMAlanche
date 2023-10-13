package controllers

import (
	"errors"
	"net/http"

	"github.com/RIP-Comm/AMAlanche/services"

	"github.com/RIP-Comm/AMAlanche/utils"

	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/gin-gonic/gin"
)

type UserController struct{}

func (uc *UserController) getUserById() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		if id == "" {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: utils.IdNotFoundMessage})
			return
		}

		user, err := services.GetUserById(id)
		if err != nil {
			if errors.Is(err, utils.UserNotFound) {
				c.JSON(http.StatusNotFound, err.Error())
			} else {
				c.JSON(http.StatusInternalServerError, err.Error())
			}
		}

		c.JSON(
			http.StatusOK,
			dto.UserResponse{
				Username: user.Username,
				Email:    user.Email,
			})
	}
}
