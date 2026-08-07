package server

import (
	"errors"
	"fmt"
	"log/slog"
	"net"
	"net/http"

	"github.com/gofiber/fiber/v3"
)

// Start launches the HTTP server on the specified port and blocks until the server stops.
// Returns an error if the listener fails to bind or crashes unexpectedly.
func Start(app *fiber.App, port int) error {
	slog.Info("Starting HTTP server", "port", port)

	err := app.Listen(fmt.Sprintf(":%d", port))
	if err != nil && !errors.Is(err, http.ErrServerClosed) && !errors.Is(err, net.ErrClosed) {
		slog.Error("Server listener failed unexpectedly", "error", err)
		return fmt.Errorf("server listen failure on port %d: %w", port, err)
	}

	slog.Info("Server gracefully closed")
	return nil
}
