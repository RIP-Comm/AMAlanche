package controllers

import (
	"github.com/gin-gonic/gin"
)

func SetupAPIRoutes(router *gin.Engine) {
	authController := &AuthController{}
	userController := &UserController{}

	api := router.Group("/api")
	{
		// auth
		authApi := api.Group("/auth")
		authApi.POST("/google/login", authController.GoogleLoginWithCode())
		authApi.POST("/google/refresh", authController.GoogleRefreshToken())

		// user
		userApi := api.Group("/user")
		userApi.GET("/:id", userController.getUserById())
	}
}
