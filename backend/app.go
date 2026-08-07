package main

import (
	"log/slog"
	"os"

	"github.com/vickbk/finance-app/backend/server"
)

func main() {
	ctx, stop := server.SetupContext()

	if err := server.Run(ctx, stop); err != nil {
		slog.Error("Application startup failed", "error", err)
		os.Exit(1)
	}
}
