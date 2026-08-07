package errors

import "net/http"

// NotFound manages not found errors
func NotFound(message string) *AppError {
	return New(http.StatusNotFound, "NOT_FOUND", message)
}
