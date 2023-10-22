package controllers

import (
	_ "github.com/RIP-Comm/AMAlanche/docs"
	"github.com/RIP-Comm/AMAlanche/middleware"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupAPIRoutes(router *gin.Engine) {
	authController := &AuthController{}
	userController := &UserController{}
	userChannelController := &UserChannelController{}

	// swagger
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	api := router.Group("/api")
	{
		// auth
		authApi := api.Group("/auth")
		{
			authApi.GET("/login", authController.InternalLogin())
			authApi.POST("/google/login", authController.GoogleLoginWithCode())
			authApi.POST("/google/refresh", authController.GoogleRefreshToken())
		}

		// user
		userApi := api.Group("/users")
		{
			// non authenticated
			userApi.POST("/", userController.createUser())

			// authenticated
			userApi.Use(middleware.AuthMiddleware())
			userApi.GET("/:userId", userController.getUserById())
			userApi.PUT("/:userId", userController.updateUser())

			// user
			userResourceApi := userApi.Group("/:userId/channels")
			{
				// authenticated
				userResourceApi.POST("", userChannelController.CreateChannel())
				userResourceApi.GET("/:channelId", userChannelController.GetById())
				userResourceApi.GET("/all", userChannelController.GetAll())
				userResourceApi.GET("/owner", userChannelController.GetAllOwned())
				userResourceApi.GET("/member", userChannelController.GetAllMember())
			}
		}
	}
}
