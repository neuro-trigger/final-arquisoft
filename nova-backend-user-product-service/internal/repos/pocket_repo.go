package repos

import (
    "gorm.io/gorm"
    "github.com/software-architecture-proj/nova-backend-user-product-service/internal/models"
    "github.com/google/uuid"
)

type PocketRepository interface {
    CreatePocket(pocket *models.Pocket) error
    GetPocketsByUserID(user_id uuid.UUID) ([]models.Pocket, error)
    UpdatePocket(pocket *models.Pocket) error
    DeletePocketByID(id uuid.UUID) error
}

type pocketRepo struct {
    db *gorm.DB
}

func NewPocketRepository(db *gorm.DB) PocketRepository {
	return &pocketRepo{db}
}

func (r *pocketRepo) CreatePocket(pocket *models.Pocket) error {
	return r.db.Create(pocket).Error
}

func (r *pocketRepo) GetPocketsByUserID(user_id uuid.UUID) ([]models.Pocket, error) {
	var pockets []models.Pocket
	if err := r.db.Where("user_id = ?", user_id).Find(&pockets).Error; err != nil {
		return nil, err
	}
	return pockets, nil
}

func (r *pocketRepo) UpdatePocket(pocket *models.Pocket) error {
    return r.db.Model(&models.Pocket{}).Where("id = ?", pocket.ID).Updates(pocket).Error
}

func (r *pocketRepo) DeletePocketByID(id uuid.UUID) error {
    return r.db.Where("id = ?", id).Delete(&models.Pocket{}).Error
}
