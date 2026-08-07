package errors

// Wrap function for wrapping errors
func Wrap(err error, httpCode int, code, message string) *AppError {
	return &AppError{
		HTTPCode: httpCode,
		Code:     code,
		Message:  message,
		Err:      err,
	}
}
