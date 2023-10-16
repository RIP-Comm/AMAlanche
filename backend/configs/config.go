package configs

import (
	"fmt"
	"os"
	"regexp"
	"sync"

	"github.com/RIP-Comm/AMAlanche/utils/ex"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Database DatabaseConfig `mapstructure:"database"`
	Security SecurityConfig `mapstructure:"security"`
}

type ServerConfig struct {
	Port string `mapstructure:"port"`
}

type DatabaseConfig struct {
	Host        string `mapstructure:"host"`
	Port        string `mapstructure:"port"`
	Username    string `mapstructure:"username"`
	Password    string `mapstructure:"password"`
	DBName      string `mapstructure:"db-name"`
	Driver      string `mapstructure:"driver"`
	Ssl         string `mapstructure:"ssl"`
	AutoMigrate bool   `mapstructure:"auto-migrate"`
}

type InternalConfig struct {
	RefreshSecretKey string `mapstructure:"secret-refresh-key"`
	SecretKey        string `mapstructure:"secret-key"`
}

type GoogleConfig struct {
	ClientID     string   `mapstructure:"client-id"`
	ClientSecret string   `mapstructure:"client-secret"`
	RedirectURL  string   `mapstructure:"redirect-url"`
	Scopes       []string `mapstructure:"scopes"`
}

type AuthConfig struct {
	InternalConfig InternalConfig `mapstructure:"internal"`
	GoogleConfig   GoogleConfig   `mapstructure:"google"`
}

type SecurityConfig struct {
	CorsConfig CorsConfig `mapstructure:"cors"`
	Auth       AuthConfig `mapstructure:"auth"`
}

type CorsConfig struct {
	AllowOrigins     []string `mapstructure:"allow-origins"`
	AllowCredentials bool     `mapstructure:"allow-credentials"`
	AllowHeaders     []string `mapstructure:"allow-headers"`
}

type ConfigProvider struct {
	Config Config
	once   sync.Once
}

var instanceConfig *ConfigProvider

func NewConfigInstance() *ConfigProvider {
	provider := &ConfigProvider{}
	provider.initConfig()
	return provider
}

func GetConfigInstance() *ConfigProvider {
	if instanceConfig == nil {
		instanceConfig = NewConfigInstance()
	}
	return instanceConfig
}

func (p *ConfigProvider) loadConfig() {
	// load .env if exist
	godotenv.Load(".env")

	// load properties.yaml
	viper.SetConfigType("yaml")
	viper.SetConfigFile("resources/properties.yaml")
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf(ex.StartupError, err))
	}

	allSettings := viper.AllKeys()
	for _, key := range allSettings {
		value := viper.Get(key)
		if strValue, isString := value.(string); isString {
			viper.Set(key, loadProperty(strValue))
		}
	}

	err = viper.Unmarshal(&p.Config)
	if err != nil {
		panic(fmt.Errorf(ex.StartupError, err))
	}
}

func (p *ConfigProvider) initConfig() {
	p.loadConfig()
}

func loadProperty(propery string) string {
	pattern := `\${([^:]+):([^}]+)}`

	regex := regexp.MustCompile(pattern)

	if regex.MatchString(propery) {
		matches := regex.FindStringSubmatch(propery)
		key := matches[1]
		if value := os.Getenv(key); value != "" {
			propery = value
		} else {
			propery = matches[2]
		}
	}

	return propery
}
