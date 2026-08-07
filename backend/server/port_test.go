package server

import (
	"testing"
)

func TestPortConfig(t *testing.T) {
	tests := []struct {
		name       string
		envPort    *string
		defaultVal []int
		wantPort   int
		wantErr    bool
	}{
		{
			name:       "valid env port",
			envPort:    ptr("3000"),
			defaultVal: []int{8080},
			wantPort:   3000,
			wantErr:    false,
		},
		{
			name:       "fallback to default when env unset",
			envPort:    nil,
			defaultVal: []int{8080},
			wantPort:   8080,
			wantErr:    false,
		},
		{
			name:       "error when port is out of range",
			envPort:    ptr("99999"),
			defaultVal: []int{8080},
			wantPort:   0,
			wantErr:    true,
		},
		{
			name:       "error when port is non-numeric",
			envPort:    ptr("invalid_port"),
			defaultVal: []int{8080},
			wantPort:   0,
			wantErr:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.envPort != nil {
				t.Setenv("APP_PORT", *tt.envPort)
			} else {
				t.Setenv("APP_PORT", "")
			}

			gotPort, err := PortConfig(tt.defaultVal...)
			if (err != nil) != tt.wantErr {
				t.Fatalf("PortConfig() error = %v, wantErr %v", err, tt.wantErr)
			}

			if gotPort != tt.wantPort {
				t.Errorf("PortConfig() = %d, want %d", gotPort, tt.wantPort)
			}
		})
	}
}

func ptr(s string) *string {
	return &s
}
