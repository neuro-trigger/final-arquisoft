package models

import (
	"github.com/google/uuid"

	"time"
)

type PocketCategory string

const (
	HomeCategory           PocketCategory = "home"
	EmergencyCategory      PocketCategory = "emergency"
	TripsCategory          PocketCategory = "trips"
	EntertainmentCategory  PocketCategory = "entertainment"
	StudiesCategory        PocketCategory = "studies"
	TransportationCategory PocketCategory = "transportation"
	DebtCategory           PocketCategory = "debt"
	OtherCategory          PocketCategory = "other"
)

type Pocket struct {
	ID        uuid.UUID      `gorm:"type:char(36);primaryKey"`
	UserID    uuid.UUID      `gorm:"type:char(36);not null"` // FK to user.id
	User      User           `gorm:"foreignKey:UserID;references:ID"`
	Name      string         `gorm:"type:varchar(50);not null"`
	Category  PocketCategory `gorm:"type:enum('home', 'emergency', 'trips', 'entertainment', 'studies', 'transportation', 'debt', 'other');not null"`
	Amount    int64          `gorm:"not null"` // Amount in the pocket
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt time.Time      `gorm:"index"` // Soft delete
}