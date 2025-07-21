package models

import (
	"time"

	"github.com/google/uuid"
)

type Favorite struct {
	ID     uuid.UUID `gorm:"type:char(36);primaryKey"`
	UserID uuid.UUID `gorm:"type:char(36);not null"` // FK to user.id
	User   User      `gorm:"foreignKey:UserID;references:ID"`

	FavoriteUserID uuid.UUID `gorm:"type:char(36);not null"` // FK to user.id (again)
	FavoriteUser   User      `gorm:"foreignKey:FavoriteUserID;references:ID"`
	Alias          string    `gorm:"unique;not null"`
	CreatedAt      time.Time
	DeletedAt      time.Time `gorm:"index"`
}
