package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"
	"net/http"
)

func main() {
	router := gin.Default()

	//cors
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowCredentials = true

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

	// controller
	router.GET("/socket.io/*any", gin.WrapH(socketServer))
	router.POST("/socket.io/*any", gin.WrapH(socketServer))

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

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

	// start
	router.Run(":8080")
}
