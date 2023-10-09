package entity

import "github.com/jinzhu/gorm"

type TestEntity struct {
	gorm.Model
	Testo string `json:"testo"`
}
