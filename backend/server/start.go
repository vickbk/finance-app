package server

import (
	"fmt"
	"log/slog"

	"github.com/gofiber/fiber/v3"
)

func Start(app *fiber.App, port int) {
	slog.Info("Starting HTTP server", "port", port)
	if err := app.Listen(fmt.Sprintf(":%d", port)); err != nil {
		slog.Info("Server listener stopped", "info", err)
	}

	slog.Info("Server gracefully closed")
}
