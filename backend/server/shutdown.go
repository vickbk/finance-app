package server

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/vickbk/defaults"
)

// shutdown gracefully shuts down the Fiber application when the context is canceled.
func shutdown(app *fiber.App, ctx context.Context, timeout ...time.Duration) error {
	<-ctx.Done()
	slog.Info("Shutdown signal received, closing HTTP server...")

	shutdownCtx, cancel := context.WithTimeout(
		context.Background(), defaults.Get(timeout, 5*time.Second),
	)
	defer cancel()

	if err := app.ShutdownWithContext(shutdownCtx); err != nil {
		slog.Error("Server forced to shutdown", "error", err)
		return fmt.Errorf("fiber shutdown error: %w", err)
	}

	slog.Info("Server gracefully closed")
	return nil
}
