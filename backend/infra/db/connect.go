package db

import (
	"fmt"
	"log/slog"
	"strconv"

	"github.com/vickbk/finance-app/backend/shared/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)



var DB *gorm.DB

func init() {
	DB = Connect(Params{
		Host:     config.Env["DB_HOST"],
		Port:     config.Env["DB_PORT"],
		Name:     config.Env["DB_NAME"],
		User:     config.Env["DB_USER"],
		Password: config.Env["DB_PASSWORD"],
	})
}

func Connect(config Params) *gorm.DB {
	port, err := strconv.ParseUint(config.Port, 10, 32)
	if err != nil {
		slog.Error("Port must be an unsigned number")
	}

	dblink := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		config.Host, port, config.User, config.Password, config.Name)
	DB, err := gorm.Open(postgres.Open(dblink))
	if err != nil {
		panic(fmt.Errorf("Failed to connect to the database. Error: %w", err))
	}

	slog.Info("DB connection successful")
	return DB
}
