package server

import (
	"testing"
	"time"
)

func TestStart(t *testing.T) {
	t.Run("returns error immediately when port is invalid", func(t *testing.T) {
		app := SetupApp("Test Invalid Port")

		// -1 is an invalid port number
		err := Start(app, -1)
		if err == nil {
			t.Fatal("expected error when attempting to start with invalid port, got nil")
		}
	})

	t.Run("starts listener on port 0 and unblocks cleanly on shutdown", func(t *testing.T) {
		app := SetupApp("Test Start & Stop")

		errChan := make(chan error, 1)

		// Port 0 tells the OS to allocate an available ephemeral port automatically
		go func() {
			errChan <- Start(app, 0)
		}()

		// Give the listener goroutine a brief moment to start
		time.Sleep(50 * time.Millisecond)

		// Trigger shutdown
		if err := app.Shutdown(); err != nil {
			t.Fatalf("failed to trigger app.Shutdown(): %v", err)
		}

		select {
		case err := <-errChan:
			if err != nil {
				t.Errorf("expected clean shutdown returning nil, got error: %v", err)
			}
		case <-time.After(2 * time.Second):
			t.Fatal("timed out waiting for Start() to unblock after app.Shutdown()")
		}
	})
}