package configs

import (
	"fmt"
	"log"
	"sync"

	"github.com/RIP-Comm/AMAlanche/utils/ex"

	"github.com/RIP-Comm/AMAlanche/models/entity"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type DatabaseProvider struct {
	DB   *gorm.DB
	once sync.Once
}

var instanceDB *DatabaseProvider

func NewDBInstance() *DatabaseProvider {
	provider := &DatabaseProvider{}
	provider.initDB()
	return provider
}

func GetDBInstance() *DatabaseProvider {
	if instanceDB == nil {
		instanceDB = NewDBInstance()
	}
	return instanceDB
}

func (p *DatabaseProvider) initDB() {
	databaseConfig := GetConfigInstance().Config.Database
	url := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		databaseConfig.Host,
		databaseConfig.Port,
		databaseConfig.Username,
		databaseConfig.Password,
		databaseConfig.DBName,
		databaseConfig.Ssl)

	db, err := gorm.Open(databaseConfig.Driver, url)
	if err != nil {
		panic(fmt.Errorf(ex.StartupError, err))
	}

	p.DB = db

	// migrate
	p.migrateDB()
}

func (p *DatabaseProvider) migrateDB() {
	databaseConfig := GetConfigInstance().Config.Database

	if databaseConfig.AutoMigrate {
		log.Println("Start auto DB migration")
		p.DB.AutoMigrate(&entity.User{})
		log.Println("End auto DB migration")
	}
}
