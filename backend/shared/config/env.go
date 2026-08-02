package config

import (
	"log/slog"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

var Env = make(map[string]string)

func init() {
	err := godotenv.Load(".env")

	if err != nil {
		slog.Error("Error loading .env file")
	}

	for _, env := range os.Environ() {
		pair := strings.SplitN(env, "=", 2)
		Env[pair[0]] = pair[1]
	}
}

func EnvGet(key string, defaultValue ...string) string {
	if value, exists := Env[key]; exists {
		return value
	}
	if len(defaultValue) > 0 {
		return defaultValue[0]
	}
	return ""
}
