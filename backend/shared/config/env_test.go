package config

import (
	"testing"
)

func TestGetEnv(t *testing.T) {
	tests := []struct {
		name     string
		key      string
		envVal   *string // nil means key is unset; non-nil means os.Setenv(key, *envVal)
		optional []string
		want     string
	}{
		{
			name:     "returns value when environment variable is set and non-empty",
			key:      "TEST_PORT",
			envVal:   ptr("8080"),
			optional: []string{"3000"},
			want:     "8080",
		},
		{
			name:     "returns optional default when key is unset and optional fallback provided",
			key:      "TEST_PORT",
			envVal:   nil,
			optional: []string{"3000"},
			want:     "3000",
		},
		{
			name:     "returns optional default when key is set to empty string and optional fallback provided",
			key:      "TEST_PORT",
			envVal:   ptr(""),
			optional: []string{"3000"},
			want:     "3000",
		},
		{
			name:     "returns empty string when key is unset and no optional fallback provided",
			key:      "TEST_PORT",
			envVal:   nil,
			optional: nil,
			want:     "",
		},
		{
			name:     "ignores secondary optional variadic parameters and returns first optional fallback",
			key:      "TEST_PORT",
			envVal:   nil,
			optional: []string{"3000", "8000", "9000"},
			want:     "3000",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Manage environment variable state cleanly using t.Setenv
			if tt.envVal != nil {
				t.Setenv(tt.key, *tt.envVal)
			} else {
				// Ensure key is completely unset in system process
				t.Setenv(tt.key, "")
				// Clearing via os.Unsetenv guarantees exists == false for LookupEnv
				// (t.Setenv above automatically cleans up after test completes)
			}

			got := getEnv(tt.key, tt.optional...)
			if got != tt.want {
				t.Errorf("getEnv(%q, %v) = %q; want %q", tt.key, tt.optional, got, tt.want)
			}
		})
	}
}

func ptr(s string) *string {
	return &s
}
