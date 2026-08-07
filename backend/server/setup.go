package server

import (
	"github.com/gofiber/fiber/v3"

	"github.com/vickbk/finance-app/backend/shared/response"
)

func setupApp(name string) (app *fiber.App) {
	app = fiber.New(fiber.Config{
		AppName:      name,
		ErrorHandler: response.ErrorHandler,
	})
	return
}
