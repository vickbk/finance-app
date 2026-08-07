package db

import (
	"fmt"
	"log/slog"
	"strconv"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/vickbk/finance-app/backend/shared/config"
)

// DB is a global variable that holds the database connection instance.
var DB *gorm.DB

func init() {
	DB = Connect(params{
		Host:     config.ENV.DB_HOST,
		Port:     config.ENV.DB_PORT,
		Name:     config.ENV.DB_NAME,
		User:     config.ENV.DB_USER,
		Password: config.ENV.DB_PASSWORD,
	})
}

// Connect establishes a connection to the PostgreSQL database using the provided configuration parameters. It returns a pointer to the gorm.DB instance.
func Connect(options params) *gorm.DB {
	port, err := strconv.ParseUint(options.Port, 10, 32)
	if err != nil {
		slog.Error("Port must be an unsigned number")
	}

	dblink := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		options.Host, port, options.User, options.Password, options.Name)
	DB, err := gorm.Open(postgres.Open(dblink))
	if err != nil {
		panic(fmt.Errorf("failed to connect to the database. Error: %w", err))
	}

	slog.Info("DB connection successful")
	return DB
}
