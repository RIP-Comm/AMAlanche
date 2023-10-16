package services

import (
	"encoding/json"
	"net/http"

	"github.com/RIP-Comm/AMAlanche/configs"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

func GoogleLogin(code string, c *gin.Context) (*oauth2.Token, error) {
	googleTokenResp, err := configs.GoogleOauthConfig.Exchange(c, code)
	if err != nil {
		return nil, err
	}
	return googleTokenResp, nil
}

func GoogleGetProfile(token *oauth2.Token, c *gin.Context) (map[string]interface{}, error) {
	client := configs.GoogleOauthConfig.Client(c, token)
	googleInfoResp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return nil, err
	}
	defer googleInfoResp.Body.Close()

	var profileData map[string]interface{}
	if err := json.NewDecoder(googleInfoResp.Body).Decode(&profileData); err != nil {
		return nil, err
	}

	return profileData, nil
}

func GoogleValidateToken(token string, c *gin.Context) (bool, error) {
	client := configs.GoogleOauthConfig.Client(c, &oauth2.Token{AccessToken: token})
	resp, err := client.Get("https://www.googleapis.com/oauth2/v1/userinfo")
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false, nil
	}

	return true, nil
}
