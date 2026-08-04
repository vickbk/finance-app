package port

import (
	"errors"
	"fmt"
)

var errInvalidPort = errors.New("invalid port number")

const (
	minPort = 1024 // Set to 1 if privileged ports (80, 443) should be permitted
	maxPort = 65535
)

// IsValid checks if the port is within the allowed TCP/UDP range (1024 - 65535).
func IsValid(port int) bool {
	return port >= minPort && port <= maxPort
}

// Validate checks port validity and returns a wrapped error if invalid.
func Validate(port int) error {
	if !IsValid(port) {
		return fmt.Errorf("%w: got %d (must be between %d and %d)",
			errInvalidPort, port, minPort, maxPort)
	}
	return nil
}
