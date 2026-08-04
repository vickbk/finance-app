package server

import (
	"context"
	"net"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
)

func TestShutdown(t *testing.T) {
	t.Run("gracefully shuts down server upon context cancellation", func(t *testing.T) {
		app := fiber.New()

		// Allocate a free local port dynamically for testing
		ln, err := net.Listen("tcp", "127.0.0.1:0")
		if err != nil {
			t.Fatalf("failed to bind test listener: %v", err)
		}

		// Start server listener in background
		go func() {
			_ = app.Listener(ln)
		}()

		// Create a cancelable context
		ctx, cancel := context.WithCancel(context.Background())

		errChan := make(chan error, 1)
		go func() {
			errChan <- Shutdown(app, ctx, 100*time.Millisecond)
		}()

		// Trigger shutdown by canceling the context
		cancel()

		select {
		case err := <-errChan:
			if err != nil {
				t.Errorf("expected clean shutdown, got error: %v", err)
			}
		case <-time.After(2 * time.Second):
			t.Fatal("Shutdown timed out and did not return")
		}
	})

	t.Run("returns immediately if context is already canceled", func(t *testing.T) {
		app := fiber.New()
		ctx, cancel := context.WithCancel(context.Background())
		cancel() // Pre-cancel context

		errChan := make(chan error, 1)
		go func() {
			errChan <- Shutdown(app, ctx, 50*time.Millisecond)
		}()

		select {
		case err := <-errChan:
			if err != nil {
				t.Errorf("expected nil error, got: %v", err)
			}
		case <-time.After(1 * time.Second):
			t.Fatal("Shutdown blocked on pre-canceled context")
		}
	})
}
