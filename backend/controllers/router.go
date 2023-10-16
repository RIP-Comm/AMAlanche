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

	// swagger
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	api := router.Group("/api")
	{
		// auth
		authApi := api.Group("/auth")
		authApi.GET("/login", authController.InternalLogin())
		authApi.POST("/google/login", authController.GoogleLoginWithCode())
		authApi.POST("/google/refresh", authController.GoogleRefreshToken())

		// user
		userApi := api.Group("/user")

		// non authenticated
		userApi.POST("/", userController.createUser())

		// authenticated
		userApi.Use(middleware.AuthMiddleware())
		userApi.GET("/:id", userController.getUserById())
		userApi.PUT("/:id", userController.updateUser())

	}
}
