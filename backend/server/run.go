package server

import (
	"context"
	"fmt"
	"time"
)

// Run encapsulates application startup and lifecycle. Returning an error allows
// tests to verify startup failures cleanly without calling os.Exit.
func Run(ctx context.Context) error {
	port, err := PortConfig(8080)
	if err != nil {
		return fmt.Errorf("port config failed: %w", err)
	}

	app := SetupApp("Finance Api v1")

	// Wire graceful shutdown listener
	go func() {
		_ = Shutdown(app, ctx, 5*time.Second)
	}()

	return Start(app, port)
}