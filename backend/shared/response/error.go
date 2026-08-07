package response

import (
	"log/slog"

	"github.com/gofiber/fiber/v3"
	"github.com/vickbk/defaults"
)

// Error takes arguments and translate them into an API response
func Error(c fiber.Ctx, code int, codeText, message string, details ...any) error {
	c.Status(code)
	slog.Error(codeText, "error", message, "details", defaults.Get(details, nil))
	return c.JSON(APIResponse[any]{Success: false, Error: &APIError{
		Code:    codeText,
		Message: message,
	}, Meta: codeText})
}
