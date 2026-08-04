package config

import (
	"fmt"
	"strconv"
)

// EnvToInt retrieves an environment variable as an integer.
// Returns defaultVal[0] if unset/empty and a default is provided.
// Returns an error if unset without a default, or if parsing fails.
func EnvToInt(param string, defaultVal ...int) (int, error) {
	val := getEnv(param)
	if val == "" {
		if len(defaultVal) > 0 {
			return defaultVal[0], nil
		}
		return 0, fmt.Errorf("environment variable %s is missing and no default value provided", param)
	}

	i, err := strconv.Atoi(val)
	if err != nil {
		return 0, fmt.Errorf("environment variable %s has invalid integer value %q: %w", param, val, err)
	}

	return i, nil
}
