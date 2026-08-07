package errors

// AppError represents a predictable domain/business logic error.
type AppError struct {
	HTTPCode int    `json:"-"`
	Code     string `json:"code"`
	Message  string `json:"message"`
	Details  any    `json:"details,omitempty"`
	Err      error  `json:"-"` // Internal cause (for logging)
}
