package response

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/gofiber/fiber/v3"

	innerErrors "github.com/vickbk/finance-app/backend/shared/response/modules/errors"
)

// ErrorHandler is the global Fiber error handler middleware.
func ErrorHandler(c fiber.Ctx, err error) error {
	if err == nil {
		return nil
	}

	var appErr *innerErrors.AppError
	var fiberErr *fiber.Error

	switch {
	// 1. Custom Domain Errors
	case errors.As(err, &appErr):
		if appErr.HTTPCode >= 500 {
			slog.Error(
				"Internal domain error",
				"code",
				appErr.Code,
				"error",
				appErr.Err,
				"path",
				c.Path(),
			)
		}
		return Error(c, appErr.HTTPCode, appErr.Code, appErr.Message, appErr.Details)

	// 2. Native Fiber / Framework Errors (e.g. 404 Route Not Found, 405 Method Not Allowed)
	case errors.As(err, &fiberErr):
		code := http.StatusText(fiberErr.Code)
		return Error(c, fiberErr.Code, code, fiberErr.Message)

	// 3. Unhandled Runtime Errors (Panics, unexpected DB crashes)
	default:
		slog.Error("Unhandled unexpected error", "error", err, "path", c.Path())
		return Error(
			c,
			http.StatusInternalServerError,
			"INTERNAL_SERVER_ERROR",
			"An internal error occurred",
		)
	}
}
