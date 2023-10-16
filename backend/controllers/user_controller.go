package controllers

import (
	"net/http"

	"github.com/RIP-Comm/AMAlanche/models/entity"
	"github.com/RIP-Comm/AMAlanche/utils/role"
	"golang.org/x/crypto/bcrypt"

	"github.com/RIP-Comm/AMAlanche/utils/ex"

	"github.com/RIP-Comm/AMAlanche/services"

	"github.com/RIP-Comm/AMAlanche/utils"

	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/gin-gonic/gin"
)

type UserController struct{}

// @tags User
// @Summary Retrieve user information by ID
// @Description Retrieves user information based on the provided user ID.
// @Accept  json
// @Produce  json
// @Param id path int true "User ID"
// @Success 200 {object} dto.UserResponse "User information retrieved successfully"
// @Failure 400 {object} dto.ErrorResponse "Invalid or missing ID"
// @Failure 404 {object} dto.ErrorResponse "User not found"
// @Failure 500 {object} dto.ErrorResponse "Internal server error"
// @Router /user/{id} [get]
func (uc *UserController) getUserById() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")

		id, err := utils.StrToUint(idStr)
		if idStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.IdNotFoundMessage})
			return
		}

		user, customError := services.GetUserById(id)
		if customError != &ex.NoError {
			if customError == &ex.UserNotFound {
				c.JSON(http.StatusNotFound, customError.Message)
			} else {
				c.JSON(http.StatusInternalServerError, customError.Message)
			}
			return
		}

		c.JSON(
			http.StatusOK,
			dto.UserResponse{
				Id:       user.ID,
				Username: user.Username,
				Email:    user.Email,
			})
	}
}

// @tags User
// @Summary Create a new user
// @Description Creates a new user with the provided details.
// @Accept  json
// @Produce  json
// @Param requestBody body dto.UserCreateRequest true "User creation request"
// @Success 200 {object} entity.User "User created successfully"
// @Failure 400 {object} dto.ErrorResponse "Invalid JSON request"
// @Failure 500 {object} dto.ErrorResponse "Internal server error"
// @Router /user [post]
func (uc *UserController) createUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		var requestBody dto.UserCreateRequest

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.BadRequestInvalidJsonMessage})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(requestBody.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}

		newUser := entity.User{
			Username: requestBody.Username,
			Password: string(hashedPassword),
			Email:    requestBody.Email,
			Role:     role.UserRole,
		}
		user, customError := services.CreateUser(newUser)
		if customError != &ex.NoError {
			if customError.Code == ex.ConflictCode {
				c.JSON(http.StatusConflict, customError.Message)
			} else {
				c.JSON(http.StatusInternalServerError, customError.Message)
			}
			return
		}

		c.JSON(http.StatusOK, user)
	}
}

// @tags User
// @Summary Update user information by ID
// @Description Updates user information based on the provided user ID and request details.
// @Accept  json
// @Produce  json
// @Param id path int true "User ID"
// @Param requestBody body dto.UserUpdateRequest true "User update request"
// @Success 200 {object} dto.UserResponse "User information updated successfully"
// @Failure 400 {object} dto.ErrorResponse "Invalid or missing ID or JSON request"
// @Failure 403 {object} dto.ErrorResponse "Forbidden action"
// @Failure 404 {object} dto.ErrorResponse "User not found"
// @Failure 500 {object} dto.ErrorResponse "Internal server error"
// @Router /user/{id} [put]
func (uc *UserController) updateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")

		id, err := utils.StrToUint(idStr)
		if idStr == "" || err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.IdNotFoundMessage})
			return
		}

		var requestBody dto.UserUpdateRequest

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.BadRequestInvalidJsonMessage})
			return
		}

		user, customError := services.UpdateUser(id, requestBody, c)
		if customError != &ex.NoError {
			if customError.Code == ex.ConflictCode {
				c.JSON(http.StatusConflict, customError.Message)
			} else if customError.Code == ex.ForbiddenCode {
				c.JSON(http.StatusForbidden, customError.Message)
			} else {
				c.JSON(http.StatusInternalServerError, customError.Message)
			}
			return
		}

		c.JSON(
			http.StatusOK,
			dto.UserResponse{
				Id:       user.ID,
				Username: user.Username,
				Email:    user.Email,
			})
	}
}
