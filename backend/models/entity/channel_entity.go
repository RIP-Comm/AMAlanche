package entity

import "github.com/jinzhu/gorm"

type Channel struct {
	gorm.Model
	Name    string `json:"name"`
	OwnerId uint   `json:"ownerId"`
	Members []User `json:"members" gorm:"many2many:channel_members"`
}
