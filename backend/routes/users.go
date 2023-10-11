package routes

import "github.com/gin-gonic/gin"
import "github.com/RIP-Comm/AMAlanche/controllers"

func Users(route *gin.Engine) {
	router := route.Group("/users")

	router.POST("/", controllers.AddUser)
	router.GET("/login", controllers.Login)

}
