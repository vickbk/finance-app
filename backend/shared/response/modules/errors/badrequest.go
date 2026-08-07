package errors

import "net/http"

// BadRequest manages bad request errors
func BadRequest(code, message string) *AppError {
	return New(http.StatusBadRequest, code, message)
}
