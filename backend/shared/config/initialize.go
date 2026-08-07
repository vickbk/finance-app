package config

import (
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

func initialize(env ...string) error {
	if err := godotenv.Load(env...); err != nil {
		if os.IsNotExist(err) {
			slog.Debug("No .env file found; relying on system environment variables")
		} else {
			slog.Warn("Failed to load .env file", "error", err)
		}
	}

	ENV = Params{
		DB_HOST:     getEnv("DB_HOST"),
		DB_PORT:     getEnv("DB_PORT"),
		DB_NAME:     getEnv("DB_NAME"),
		DB_USER:     getEnv("DB_USER"),
		DB_PASSWORD: getEnv("DB_PASSWORD"),
		APP_PORT:    getEnv("APP_PORT", "8080"),
		JWT_SECRET:  getEnv("JWT_SECRET"),
	}

	if err := ENV.validateParams(); err != nil {
		return err
	}
	return nil
}
