package server

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"github.com/vickbk/defaults"
)

func SetupContext(parent ...context.Context) (ctx context.Context, stop context.CancelFunc) {
	ctx, stop = signal.NotifyContext(
		defaults.Get(parent, context.Background()),
		os.Interrupt, syscall.SIGTERM)
	return
}
