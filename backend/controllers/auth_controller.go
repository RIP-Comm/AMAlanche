package controllers

import (
	"net/http"
	"time"

	"github.com/RIP-Comm/AMAlanche/utils/role"

	"github.com/gofrs/uuid"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"

	"github.com/RIP-Comm/AMAlanche/utils/ex"

	"golang.org/x/oauth2"

	"github.com/RIP-Comm/AMAlanche/configs"
	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/RIP-Comm/AMAlanche/models/entity"
	"github.com/RIP-Comm/AMAlanche/services"
	"github.com/gin-gonic/gin"
)

type AuthController struct{}

// @tags Auth
// @Summary Perform Google login using authorization code
// @Description Perform Google login using an authorization code and return an access token.
// @Accept  json
// @Produce  json
// @Param requestBody body dto.AuthGoogleLoginRequest true "Google login request"
// @Success 200 {object} dto.AuthGoogleTokenResponse "Successfully generated Google access token"
// @Failure 400 {object} dto.ErrorResponse "Invalid JSON request"
// @Failure 500 {object} dto.ErrorResponse "Internal server error"
// @Router /auth/google-login [post]
func (uc *AuthController) GoogleLoginWithCode() gin.HandlerFunc {
	return func(c *gin.Context) {
		var requestBody dto.AuthGoogleLoginRequest

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.BadRequestInvalidJsonMessage})
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
		username := profileData["name"].(string)
		var userId uint
		user, customError := services.GetUserByEmail(email)
		if customError != &ex.NoError {
			if customError == &ex.UserNotFound {
				services.GetFirstValidUsername(&username)
				newUUID, err := uuid.NewV4()
				if err != nil {
					c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
					return
				}
				randomPassword := newUUID.String()
				newUser := entity.User{
					Email:    email,
					Username: username,
					Password: randomPassword,
					Role:     role.UserRole,
				}
				user, internalError := services.CreateUser(newUser)
				if internalError != &ex.NoError {
					if customError.Code == ex.ConflictCode {
						c.JSON(http.StatusConflict, customError.Message)
						return
					}
					c.JSON(http.StatusInternalServerError, internalError.Message)
					return
				} else {
					userId = user.ID
				}
			} else {
				c.JSON(http.StatusInternalServerError, customError.Message)
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

// @tags Auth
// @Summary Update a Google access token using a refresh token
// @Description Update a Google access token using a refresh token and return the new access token.
// @Accept  json
// @Produce  json
// @Param refreshRequest body dto.AuthGoogleRefreshRequest true "Google access token refresh request"
// @Success 200 {object} dto.AuthGoogleTokenResponse "Successfully updated Google access token"
// @Failure 400 {object} dto.ErrorResponse "Invalid JSON request"
// @Failure 500 {object} dto.ErrorResponse "Internal server error"
// @Router /auth/google-refresh [post]
func (uc *AuthController) GoogleRefreshToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		var refreshRequest dto.AuthGoogleRefreshRequest

		if err := c.ShouldBindJSON(&refreshRequest); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.BadRequestInvalidJsonMessage})
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

// @tags Auth
// @Summary Perform internal login using credentials
// @Description Perform internal login using credentials and return an access token.
// @Accept  json
// @Produce  json
// @Param requestBody body dto.AuthInternalLoginRequest true "Internal login request"
// @Success 200 {object} dto.AuthInternalLoginResponse "Successfully generated internal access token"
// @Failure 400 {object} dto.ErrorResponse "Invalid JSON request"
// @Failure 401 {object} dto.ErrorResponse "Invalid credentials"
// @Failure 500 {object} dto.ErrorResponse "Internal server error"
// @Router /auth/internal-login [post]
func (uc *AuthController) InternalLogin() gin.HandlerFunc {
	return func(c *gin.Context) {
		internalAuthConfig := configs.GetConfigInstance().Config.Security.Auth.InternalConfig

		var requestBody dto.AuthInternalLoginRequest

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.BadRequestInvalidJsonMessage})
			return
		}

		currentUser, customError := services.GetUserByUsername(requestBody.Username)
		if customError != &ex.NoError {
			if customError == &ex.UserNotFound {
				c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: ex.BadCredentialMessage})
			} else {
				c.JSON(http.StatusInternalServerError, customError.Message)
			}
			return
		}

		if bcrypt.CompareHashAndPassword([]byte(currentUser.Password), []byte(requestBody.Password)) != nil {
			c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: ex.BadCredentialMessage})
			return
		}

		expiry := time.Now().Add(time.Minute * 5).Unix()
		token := jwt.MapClaims{}
		token["username"] = currentUser.Username
		token["role"] = currentUser.Role
		token["id"] = currentUser.ID
		token["email"] = currentUser.Email
		token["exp"] = expiry

		accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, token).SignedString([]byte(internalAuthConfig.SecretKey))
		if err != nil {
			c.JSON(http.StatusInternalServerError, customError.Message)
			return
		}

		c.JSON(http.StatusOK, dto.AuthInternalLoginResponse{
			UserId:      &currentUser.ID,
			AccessToken: accessToken,
			Expiry:      time.Unix(expiry, 0),
		})
	}
}
