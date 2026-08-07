package errors

import "net/http"

// Unauthorized error builder
func Unauthorized(message string) *AppError {
	return New(http.StatusUnauthorized, "UNAUTHORIZED", message)
}
