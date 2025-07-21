package models

import (
	"github.com/google/uuid"
)

type CountryCode struct {
	ID   uuid.UUID `gorm:"type:char(36);primaryKey"`
	Name string    `gorm:"unique;not null"`
	Code int16     `gorm:"unique;not null"`
}
