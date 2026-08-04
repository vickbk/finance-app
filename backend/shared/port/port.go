package port

import (
	"errors"
	"fmt"
)

var ErrInvalidPort = errors.New("invalid port number")

const (
	MinPort = 1024 // Set to 1 if privileged ports (80, 443) should be permitted
	MaxPort = 65535
)

// IsValid checks if the port is within the allowed TCP/UDP range (1024 - 65535).
func IsValid(port int) bool {
	return port >= MinPort && port <= MaxPort
}

// Validate checks port validity and returns a wrapped error if invalid.
func Validate(port int) error {
	if !IsValid(port) {
		return fmt.Errorf("%w: got %d (must be between %d and %d)", ErrInvalidPort, port, MinPort, MaxPort)
	}
	return nil
}
