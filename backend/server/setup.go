package server

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v3"
)

func SetupApp(name string) (app *fiber.App, ctx context.Context, stop context.CancelFunc) {
	app = fiber.New(fiber.Config{
		AppName: name,
	})

	// Middleware and routes will be registered here later

	ctx, stop = signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	return app, ctx, stop

}
