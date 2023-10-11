package main

import (
	"fmt"
	"github.com/RIP-Comm/AMAlanche/configs"
	"github.com/RIP-Comm/AMAlanche/models/entity"
	"github.com/RIP-Comm/AMAlanche/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"
	"net/http"
)

func main() {
	// load configs
	serverConfig := configs.GetConfigInstance().Config.Server
	securityConfig := configs.GetConfigInstance().Config.Security
	// database
	databaseProvicer := configs.GetDBInstance()
	router := gin.Default()

	// setup cors
	config := cors.DefaultConfig()
	config.AllowOrigins = securityConfig.CorsConfig.AllowOrigins
	config.AllowCredentials = securityConfig.CorsConfig.AllowCredentials

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

	routes.Users(router)

	// test send socket message
	router.POST("/send", func(c *gin.Context) {
		var requestBody struct {
			Room    string `json:"room"`
			Message string `json:"message"`
		}

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON request"})
			return
		}

		messageJSON := map[string]interface{}{
			"body": string(requestBody.Message),
		}
		socketServer.BroadcastToRoom("/", requestBody.Room, "message", messageJSON)

		c.JSON(http.StatusOK, gin.H{"message": "The message has been successfully sent"})
	})

	// test db add row
	router.POST("/test-db", func(c *gin.Context) {
		var requestBody struct {
			Testo string `json:"testo"`
		}

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON request"})
			return
		}

		newEntity := entity.TestEntity{Testo: requestBody.Testo}
		databaseProvicer.DB.Create(&newEntity)

		c.JSON(200, gin.H{"message": "Row saved successfully"})
	})

	// start
	router.Run(":" + serverConfig.Port)
}
