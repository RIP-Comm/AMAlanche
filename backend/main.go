package main

import (
	"fmt"
	"net/http"

	"github.com/RIP-Comm/AMAlanche/utils/ex"

	"github.com/RIP-Comm/AMAlanche/models/dto"

	"github.com/RIP-Comm/AMAlanche/configs"
	"github.com/RIP-Comm/AMAlanche/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"
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

	// socket
	socketServer := socketio.NewServer(nil)

	socketServer.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("Socket.io Connected:", s.ID())
		return nil
	})

	socketServer.OnEvent("/", "join", func(s socketio.Conn, room string) {
		s.Join(room)
		fmt.Printf("User %s joined the room: %s\n", s.ID(), room)
	})

	socketServer.OnDisconnect("/", func(s socketio.Conn, reason string) {
		fmt.Println("Socket.io disconnected:", s.ID(), reason)
	})

	go socketServer.Serve()
	defer socketServer.Close()

	// controllers
	router.GET("/socket.io/*any", gin.WrapH(socketServer))
	router.POST("/socket.io/*any", gin.WrapH(socketServer))

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

		messageJSON := map[string]interface{}{
			"body": string(requestBody.Message),
		}
		socketServer.BroadcastToRoom("/", requestBody.Room, "message", messageJSON)

		c.JSON(http.StatusOK, gin.H{"message": "The message has been successfully sent"})
	})

	// init router
	controllers.SetupAPIRoutes(router)

	// start
	router.Run(":" + serverConfig.Port)
}
