package server

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"github.com/vickbk/defaults"
)

// SetupContext creates a context that is canceled when an interrupt or termination signal is received. It returns the context and a cancel function to stop the context.
func SetupContext(parent ...context.Context) (ctx context.Context, stop context.CancelFunc) {
	ctx, stop = signal.NotifyContext(
		defaults.Get(parent, context.Background()),
		os.Interrupt, syscall.SIGTERM)
	return
}
