package errors

import (
	"errors"
	"net/http"
)

// Internal manages internal errors
func Internal(err string) *AppError {
	return Wrap(
		errors.New(err),
		http.StatusInternalServerError,
		"INTERNAL_ERROR",
		"An unexpected error occurred",
	)
}
