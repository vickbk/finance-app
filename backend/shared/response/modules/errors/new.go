package errors

// New is the Common Domain Error Constructors
func New(httpCode int, code, message string) *AppError {
	return &AppError{
		HTTPCode: httpCode,
		Code:     code,
		Message:  message,
	}
}
