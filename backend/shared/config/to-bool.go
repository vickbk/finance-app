package config

import (
	"fmt"
	"strconv"
)

// EnvToBool retrieves an environment variable as a boolean.
// Standard truthy values: "1", "t", "T", "true", "TRUE", "True"
// Standard falsy values: "0", "f", "F", "false", "FALSE", "False"
//
// Returns defaultVal[0] if unset/empty and a default is provided.
// Returns an error if unset without a default, or if parsing fails.
func EnvToBool(param string, defaultVal ...bool) (bool, error) {
	val := getEnv(param)
	if val == "" {
		if len(defaultVal) > 0 {
			return defaultVal[0], nil
		}
		return false, fmt.Errorf("environment variable %s is missing and no default value provided", param)
	}

	b, err := strconv.ParseBool(val)
	if err != nil {
		return false, fmt.Errorf("environment variable %s has invalid boolean value %q: %w", param, val, err)
	}

	return b, nil
}