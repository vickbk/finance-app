package config

import (
	"flag"
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

var ENV = Params{}

func init() {
	if err := godotenv.Load(); err != nil {
		if os.IsNotExist(err) {
			slog.Debug("No .env file found; relying on system environment variables")
		} else {
			slog.Warn("Failed to load .env file", "error", err)
		}
	}

	ENV = Params{
		DB_HOST:     getEnv("DB_HOST", ""),
		DB_PORT:     getEnv("DB_PORT", ""),
		DB_NAME:     getEnv("DB_NAME", ""),
		DB_USER:     getEnv("DB_USER", ""),
		DB_PASSWORD: getEnv("DB_PASSWORD", ""),
		JWT_SECRET:  getEnv("JWT_SECRET", ""),
	}

	if flag.Lookup("test.v") != nil {
		return
	}

	if err := ENV.validateParams(); err != nil {
		slog.Error("❌ Configuration Error", "error", err)
		os.Exit(1)
	}
}

func getEnv(key string, optional ...string) string {
	if val, exists := os.LookupEnv(key); exists && val != "" {
		return val
	}
	if len(optional) > 0 {
		return optional[0]
	}
	return ""
}
