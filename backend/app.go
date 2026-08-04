package main

import (
	"log/slog"
	"os"
	"time"

	"github.com/vickbk/finance-app/backend/server"
)

func main() {
	port, err := server.PortConfig(8080)
	if err != nil {
		slog.Error("Error validating port", "error", err)
		os.Exit(1)
	}

	app, ctx, stop := server.SetupApp("Finance Api v1")

	defer stop()

	go server.Shutdown(app, ctx, 5*time.Second)

	server.Start(app, port)
}
