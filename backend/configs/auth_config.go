package configs

import (
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var GoogleOauthConfig = oauth2.Config{
	ClientID:     GetConfigInstance().Config.Security.Auth.GoogleConfig.ClientID,
	ClientSecret: GetConfigInstance().Config.Security.Auth.GoogleConfig.ClientSecret,
	RedirectURL:  GetConfigInstance().Config.Security.Auth.GoogleConfig.RedirectURL,
	Scopes:       GetConfigInstance().Config.Security.Auth.GoogleConfig.Scopes,
	Endpoint:     google.Endpoint,
}
