package main

import (
	"log/slog"
	"os"

	"github.com/vickbk/finance-app/backend/server"
)

func main() {
	ctx, stop := server.SetupContext()
	defer stop()

	if err := server.Run(ctx); err != nil {
		slog.Error("Application startup failed", "error", err)
		os.Exit(1)
	}
}
