package main

import (
	"net/http"

	"github.com/RIP-Comm/AMAlanche/utils/ex"

	"github.com/RIP-Comm/AMAlanche/models/dto"

	"github.com/RIP-Comm/AMAlanche/configs"
	"github.com/RIP-Comm/AMAlanche/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// @title 			AMAlanche
// @version			0.0.1-SNAPSHOT
// @description 	:)
// @host 			localhost:8080
// @BasePath 		/api
func main() {
	// load config
	serverConfig := configs.GetConfigInstance().Config.Server
	securityCors := configs.GetConfigInstance().Config.Security.CorsConfig

	// load db
	_ = configs.GetDBInstance()

	router := gin.Default()

	// setup cors
	config := cors.DefaultConfig()
	config.AllowOrigins = securityCors.AllowOrigins
	config.AllowCredentials = securityCors.AllowCredentials
	config.AllowHeaders = securityCors.AllowHeaders

	router.Use(cors.New(config))

	// controllers
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// test send socket message
	router.POST("/send", func(c *gin.Context) {
		var requestBody struct {
			Room    string `json:"room"`
			Message string `json:"message"`
		}

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: ex.BadRequestInvalidJsonMessage})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "The message has been successfully sent"})
	})

	// init router
	controllers.SetupAPIRoutes(router)

	// start
	router.Run(":" + serverConfig.Port)
}
