package controllers

import (
	"github.com/RIP-Comm/AMAlanche/configs"
	"github.com/RIP-Comm/AMAlanche/models/entity"
	"github.com/RIP-Comm/AMAlanche/services"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"time"
)

func Login(c *gin.Context) {

	securityConfig := configs.GetConfigInstance().Config.Security

	var requestBody struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid body"})
		return
	}

	var currentUser entity.UserEntity
	//dbInstance.DB.Table("user_entities").Where("username = ?", requestBody.Username).Scan(&currentUser)
	services.GetUser(requestBody.Username, &currentUser)

	if bcrypt.CompareHashAndPassword([]byte(currentUser.Password), []byte(requestBody.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "username or password wrong"})
		return
	}

	token := jwt.MapClaims{}
	token["username"] = currentUser.Username
	token["role"] = currentUser.Role
	token["id"] = currentUser.ID
	token["email"] = currentUser.Email
	token["exp"] = time.Now().Add(time.Minute * 5).Unix()

	accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, token).SignedString([]byte(securityConfig.SecretKey))

	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"message": err})
		return
	}

	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"message": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"accessToken": accessToken})
}

func AddUser(c *gin.Context) {
	var requestBody struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
		Email    string `json:"email" binding:"required"`
		Role     string `json:"role" binding:"required"`
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "status": 400, "message": "Invalid JSON request"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(requestBody.Password), bcrypt.DefaultCost)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "status": 400, "message": err})
		return
	}

	user, err := services.CreateUser(requestBody.Username, hashedPassword, "user", requestBody.Email)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "username or email already taken"})
		return
	}

	c.JSON(http.StatusOK, user)

}
