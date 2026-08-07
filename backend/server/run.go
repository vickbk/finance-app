package server

import (
	"context"
	"fmt"
	"time"
)

// Run encapsulates application startup and lifecycle. Returning an error allows
// tests to verify startup failures cleanly without calling os.Exit.
func Run(ctx context.Context, cancel context.CancelFunc) error {
	port, err := PortConfig(8080)
	if err != nil {
		return fmt.Errorf("port config failed: %w", err)
	}

	app := setupApp("Finance Api v1")

	defer cancel()
	go func() {
		if err := shutdown(app, ctx, 5*time.Second); err != nil {
			fmt.Printf("error occurred while shutting down app: %v\n", err)
		}
	}()

	return Start(app, port)
}
