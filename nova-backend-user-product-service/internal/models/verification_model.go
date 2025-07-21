package models

import (
	"time"

	"github.com/google/uuid"
)

type (
	VerificationType   string
	VerificationStatus string
)

const (
	EmailVerification    VerificationType   = "email"
	PhoneVerification    VerificationType   = "phone"
	VerificationPending  VerificationStatus = "pending"
	VerificationVerified VerificationStatus = "verified"
	VerificationFailed   VerificationStatus = "failed"
)

type Verification struct {
	ID     uuid.UUID          `gorm:"type:char(36);primaryKey"`
	UserID uuid.UUID          `gorm:"type:char(36);not null"` // FK to user.id
	User   User               `gorm:"foreignKey:UserID;references:ID"`
	Type   VerificationType   `gorm:"type:enum('email', 'phone');not null"`
	Status VerificationStatus `gorm:"type:enum('pending', 'verified', 'failed');not null"`

	CreatedAt time.Time
	UpdatedAt time.Time
}
