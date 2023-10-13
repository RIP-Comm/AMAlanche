package controllers

import (
	"errors"
	"net/http"

	"golang.org/x/oauth2"

	"github.com/RIP-Comm/AMAlanche/configs"
	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/RIP-Comm/AMAlanche/models/entity"
	"github.com/RIP-Comm/AMAlanche/services"
	"github.com/RIP-Comm/AMAlanche/utils"
	"github.com/gin-gonic/gin"
)

type AuthController struct{}

func (uc *AuthController) GoogleLoginWithCode() gin.HandlerFunc {
	return func(c *gin.Context) {
		var requestBody dto.AuthGoogleLoginRequest

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: utils.BadRequestInvalidJsonMessage})
			return
		}

		googleTokenResp, err := services.GoogleLogin(requestBody.Code, c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}

		profileData, err := services.GoogleGetProfile(googleTokenResp, c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		}

		email := profileData["email"].(string)
		var userId uint
		user, err := services.GetUserByEmail(email)
		if err != nil {
			errorResponse := dto.ErrorResponse{Error: err.Error()}
			if errors.Is(err, utils.UserNotFound) {
				newUser := entity.User{Email: email}
				user, err := services.CreateUser(newUser)
				if err != nil {
					errorResponse := dto.ErrorResponse{Error: err.Error()}
					c.JSON(http.StatusInternalServerError, errorResponse)
				} else {
					userId = user.ID
				}
			} else {
				c.JSON(http.StatusInternalServerError, errorResponse)
				return
			}
		} else {
			userId = user.ID
		}

		c.JSON(
			http.StatusOK,
			dto.AuthGoogleTokenResponse{
				UserId:       &userId,
				AccessToken:  googleTokenResp.AccessToken,
				RefreshToken: googleTokenResp.RefreshToken,
				Expiry:       googleTokenResp.Expiry,
			})
	}
}

func (uc *AuthController) GoogleRefreshToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		var refreshRequest dto.AuthGoogleRefreshRequest

		if err := c.ShouldBindJSON(&refreshRequest); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: utils.BadRequestInvalidJsonMessage})
			return
		}

		tokenResponse := configs.GoogleOauthConfig.TokenSource(oauth2.NoContext, &oauth2.Token{
			RefreshToken: refreshRequest.RefreshToken,
		})

		token, err := tokenResponse.Token()
		if err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(
			http.StatusOK,
			dto.AuthGoogleTokenResponse{
				UserId:       nil,
				AccessToken:  token.AccessToken,
				RefreshToken: token.RefreshToken,
				Expiry:       token.Expiry,
			})
	}
}
