package server

import (
	"context"
	"os"
	"runtime"
	"syscall"
	"testing"
	"time"
)

func TestSetupContext(t *testing.T) {
	t.Run("returns valid context and stop function with default background parent", func(t *testing.T) {
		ctx, stop := SetupContext()
		defer stop()

		if ctx == nil {
			t.Fatal("expected non-nil context")
		}

		select {
		case <-ctx.Done():
			t.Fatal("context should not be closed immediately after initialization")
		default:
		}
	})

	t.Run("canceling context via stop function", func(t *testing.T) {
		ctx, stop := SetupContext()

		select {
		case <-ctx.Done():
			t.Fatal("context should be active")
		default:
		}

		stop()

		select {
		case <-ctx.Done():
			// Pass: context successfully canceled
		case <-time.After(100 * time.Millisecond):
			t.Fatal("expected context to be canceled within timeout after calling stop()")
		}
	})

	t.Run("inherits cancellation from explicit parent context", func(t *testing.T) {
		parentCtx, parentCancel := context.WithCancel(context.Background())
		ctx, stop := SetupContext(parentCtx)
		defer stop()

		// Cancel parent
		parentCancel()

		select {
		case <-ctx.Done():
			// Pass: child context derived from parent was canceled
		case <-time.After(100 * time.Millisecond):
			t.Fatal("expected derived context to be canceled when parent context is canceled")
		}
	})

	t.Run("cancels context on OS signal trigger", func(t *testing.T) {
		ctx, stop := SetupContext()
		defer stop()

		proc, err := os.FindProcess(os.Getpid())
		if err != nil {
			t.Fatalf("failed to find current process: %v", err)
		}

		if runtime.GOOS == "windows" {
			return // Skip signal test on Windows as os.Interrupt behaves differently
		} else if err := proc.Signal(syscall.SIGTERM); err != nil {
			t.Fatalf("failed to send SIGTERM signal: %v", err)
		}

		select {
		case <-ctx.Done():
			if ctx.Err() != context.Canceled {
				t.Errorf("expected context error %v, got %v", context.Canceled, ctx.Err())
			}
		case <-time.After(1000 * time.Millisecond):
			t.Fatal("timed out waiting for context cancellation following OS signal")
		}
	})
}
