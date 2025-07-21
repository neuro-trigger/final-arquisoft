package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID       uuid.UUID               `gorm:"type:char(36);primaryKey"`
	Email    string                  `gorm:"unique;not null"`
	Username string                  `gorm:"unique;not null"`
	Phone    int64                   `gorm:"unique"`
	CodeID   uuid.UUID               `gorm:"type:char(36);not null"` // FK field
	Code     CountryCode             `gorm:"foreignKey:CodeID;references:ID"`

	FirstName string    `gorm:"not null"`
	LastName  string    `gorm:"not null"`
	Birthdate time.Time `gorm:"not null"`

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt time.Time `gorm:"index"`
}
