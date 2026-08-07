package response

// APIResponse type is the normalized API response
type APIResponse[T any] struct {
	Success bool      `json:"success"`
	Meta    any       `json:"meta,omitempty"`
	Data    T         `json:"data,omitempty"`
	Error   *APIError `json:"error,omitempty"`
}

// APIError type is the normalized response for all http response errors
type APIError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}
