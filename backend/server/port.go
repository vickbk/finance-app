package server

import (
	"fmt"

	"github.com/vickbk/finance-app/backend/shared/config"
	"github.com/vickbk/finance-app/backend/shared/port"
)

// PortConfig resolves "APP_PORT" from environment variables, verifies its value range,
// and falls back to defaultPort if unconfigured.
func PortConfig(defaultPort ...int) (int, error) {
	portInt, err := config.EnvToInt("APP_PORT", defaultPort...)
	if err != nil {
		return 0, fmt.Errorf("failed to parse APP_PORT: %w", err)
	}

	if err := port.Validate(portInt); err != nil {
		return 0, fmt.Errorf("invalid APP_PORT: %w", err)
	}

	return portInt, nil
}
