package server

import (
	"github.com/gofiber/fiber/v3"
)

func setupApp(name string) (app *fiber.App) {
	app = fiber.New(fiber.Config{
		AppName: name,
	})
	return
}
