package config

import (
	"log/slog"
	"os"
	"testing"
)

var ENV = Params{}

func init() {
	if err := initialize(); err != nil {
		if testing.Testing() {
			// In testing, we don't want to exit the process; just return
			return
		}
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
