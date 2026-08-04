package main

import (
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v3"
	"github.com/vickbk/finance-app/backend/shared/config"
	"github.com/vickbk/finance-app/backend/shared/port"
)

func main() {
	portInt, err := config.EnvToInt("APP_PORT", 8080)
	if err != nil {
		slog.Error("Error converting port to integer")
		os.Exit(1)
	}
	
	if err := port.Validate(portInt); err != nil {
		slog.Error("Invalid port provided", "error", err)
		os.Exit(1)
	}

	slog.Info("Server working:", "port", portInt)
	app := fiber.New()

	shutSignal := make(chan os.Signal, 1)
	signal.Notify(shutSignal, os.Interrupt, syscall.SIGTERM)
	go func() {
		if err := app.Listen(fmt.Sprintf(":%d", portInt)); err != nil {
			slog.Error("Error starting server:", "error", err)
		}
	}()

	<-shutSignal

	if err := app.Shutdown(); err != nil {
		slog.Error("Server forced to shutdown:", "error", err)
	}

	slog.Info("Server gracefully closed")

}
