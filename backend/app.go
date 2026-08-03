package main

import (
	"log/slog"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	"github.com/gofiber/fiber/v3"
	"github.com/vickbk/finance-app/backend/shared/config"
)

func main() {
	port := config.ENV.APP_PORT
	portInt, err := strconv.Atoi(port)
	if err != nil {
		slog.Error("Error converting port to integer")
		os.Exit(1)
	}
	config.Verify(portInt)

	slog.Info("Server working:", "port", portInt)
	app := fiber.New()

	shutSignal := make(chan os.Signal, 1)
	signal.Notify(shutSignal, os.Interrupt, syscall.SIGTERM)
	go func() {
		if err := app.Listen(":" + port); err != nil {
			slog.Error("Error starting server:", "error", err)
		}
	}()

	<-shutSignal

	if err := app.Shutdown(); err != nil {
		slog.Error("Server forced to shutdown:", "error", err)
	}

	slog.Info("Server gracefully closed")

}
