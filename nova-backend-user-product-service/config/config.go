package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables.")
	}
}

func InitDB() error {
	LoadEnv()

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")

	log.Printf("Connecting to DB with:\nHost=%s\nPort=%s\nUser=%s\nName=%s\n", host, port, user, name)

	if host == "" || port == "" || user == "" || pass == "" || name == "" {
		return fmt.Errorf("missing one or more required DB env vars")
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		host, user, pass, name, port,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("gorm.Open error: %w", err)
	}

	DB = db
	return nil
}
