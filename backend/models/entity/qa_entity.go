package entity

import "github.com/jinzhu/gorm"

type Qa struct {
	gorm.Model
	Question  string `json:"question"`
	ChannelId uint   `json:"channelId"`
	OwnerId   uint   `json:"ownerId"`
	User      User   `json:"user" gorm:"foreignKey:OwnerId"`
	ParentId  *uint  `json:"parentId"`
	Children  []Qa   `json:"children" gorm:"foreignKey:ParentId"`
}
