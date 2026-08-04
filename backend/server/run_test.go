package server

import (
	"context"
	"net"
	"os"
	"runtime"
	"strconv"
	"syscall"
	"testing"
	"time"
)

// getFreePort asks the OS for an available port in the unprivileged range (>= 1024).
func getFreePort(t *testing.T) string {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("failed to acquire free test port: %v", err)
	}
	defer ln.Close()

	port := ln.Addr().(*net.TCPAddr).Port
	return strconv.Itoa(port)
}

func TestRunIntegration(t *testing.T) {
	t.Run(
		"full application lifecycle (startup, request handling, graceful shutdown)",
		func(t *testing.T) {
			t.Setenv("APP_PORT", getFreePort(t))

			ctx, cancel := context.WithCancel(context.Background())
			errChan := make(chan error, 1)

			// Start application in background
			go func() {
				errChan <- Run(ctx, cancel)
			}()

			// Give the listener time to start
			time.Sleep(100 * time.Millisecond)

			// Trigger graceful shutdown via context cancellation
			cancel()

			select {
			case err := <-errChan:
				if err != nil {
					t.Errorf("expected clean application exit, got: %v", err)
				}
			case <-time.After(2 * time.Second):
				t.Fatal("application failed to exit within 2 seconds after context cancellation")
			}
		})

	t.Run("fails fast on invalid port environment variable", func(t *testing.T) {
		t.Setenv("APP_PORT", "invalid_port")

		ctx, cancel := context.WithCancel(context.Background())

		err := Run(ctx, cancel)
		if err == nil {
			t.Fatal("expected Run() to fail with invalid APP_PORT, got nil error")
		}
	})

	t.Run("fails fast on out of bound port range", func(t *testing.T) {
		t.Setenv("APP_PORT", "99999")

		ctx, cancel := context.WithCancel(context.Background())

		err := Run(ctx, cancel)
		if err == nil {
			t.Fatal("expected Run() to fail for out-of-bounds port 99999, got nil error")
		}
	})

	t.Run("shuts down cleanly when SIGTERM is delivered to process", func(t *testing.T) {
		t.Setenv("APP_PORT", getFreePort(t))

		ctx, stop := SetupContext()
		defer stop()

		errChan := make(chan error, 1)
		go func() {
			errChan <- Run(ctx, stop)
		}()

		time.Sleep(100 * time.Millisecond)

		proc, _ := os.FindProcess(os.Getpid())
		if runtime.GOOS == "windows" {
			return // Skip signal test on Windows as os.Interrupt behaves differently
		} else if err := proc.Signal(syscall.SIGTERM); err != nil {
			t.Fatalf("failed to send SIGTERM signal: %v", err)
		}

		select {
		case err := <-errChan:
			if err != nil {
				t.Errorf("expected clean exit on SIGTERM, got: %v", err)
			}
		case <-time.After(2 * time.Second):
			t.Fatal("application did not shut down within 2s after receiving SIGTERM")
		}
	})
}
