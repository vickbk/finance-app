package config

import (
	"log/slog"
	"os"
)

func IsValid(port int) bool {
	return port > 1024 && port < 65535
}

func Verify(port int) {
	if IsValid(port) {
		return
	}
	slog.Error("Invalid Port provided.", "min", 1025, "max", 65535, "port", port)
	os.Exit(1)
}
