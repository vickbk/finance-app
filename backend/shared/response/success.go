package response

import (
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/vickbk/defaults"
)

// Success handles standard API success responses with an optional HTTP status code (defaults to 200 OK).
func Success[T any](c fiber.Ctx, data T, code ...int) error {
	c.Status(defaults.Get(code, http.StatusOK))
	return c.JSON(APIResponse[T]{
		Success: true,
		Data:    data,
	})
}

// SuccessWithMeta handles API responses that include pagination or execution metadata.
func SuccessWithMeta[T any](c fiber.Ctx, data T, meta any, code ...int) error {
	c.Status(defaults.Get(code, http.StatusOK))
	return c.JSON(APIResponse[T]{
		Success: true,
		Data:    data,
		Meta:    meta,
	})
}
