package middleware

import (
	"net/http"
	"strings"

	"github.com/RIP-Comm/AMAlanche/utils/ex"

	"github.com/RIP-Comm/AMAlanche/models/dto"
	"github.com/RIP-Comm/AMAlanche/services"
	"github.com/RIP-Comm/AMAlanche/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authType := c.GetHeader("AuthType")
		tokenString := c.GetHeader("Authorization")

		if tokenString != "" {
			if authType == utils.GoogleAuth {
				tokenString = strings.Replace(tokenString, "Bearer ", "", 1)

				token := oauth2.Token{AccessToken: tokenString}
				profileData, err := services.GoogleGetProfile(&token, c)
				profileError := profileData["error"]
				if err != nil || profileError != nil {
					c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: ex.UnauthorizedMessage})
					c.Abort()
					return
				}

				email := profileData["email"].(string)
				user, customError := services.GetUserByEmail(email)
				if customError != &ex.NoError {
					c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: ex.UnauthorizedMessage})
					c.Abort()
					return
				}

				c.Set("authenticatedUserId", user.ID)
			} else {
				c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: ex.NotImplementedMessage})
				c.Abort()
				return
			}
		} else {
			c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: ex.UnauthorizedMessage})
			c.Abort()
			return
		}

		c.Next()
	}
}
