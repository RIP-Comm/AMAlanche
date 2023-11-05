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
	channelController := &ChannelController{}
	qaController := &QaController{}

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
			channelApi := userApi.Group("/:userId/channels")
			{
				// authenticated
				channelApi.POST("", channelController.CreateChannel())
				channelApi.GET("/:channelId", channelController.GetById())
				channelApi.PATCH("/:channelId/join", channelController.Join())
				channelApi.GET("/all", channelController.GetAll())
				channelApi.GET("/owner", channelController.GetAllOwned())
				channelApi.GET("/member", channelController.GetAllMember())

				qaApi := channelApi.Group("/:channelId/qas")
				{
					// authenticated
					qaApi.POST("", qaController.CreateQa())
				}
			}
		}
	}
}
