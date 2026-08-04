package config

import (
	"testing"
)

func TestEnvToBool(t *testing.T) {
	tests := []struct {
		name       string
		key        string
		envVal     *string
		defaultVal []bool
		want       bool
		wantErr    bool
	}{
		{
			name:       "valid truthy string 'true' returns true",
			key:        "ENABLE_FEATURE",
			envVal:     ptr("true"),
			defaultVal: []bool{false},
			want:       true,
			wantErr:    false,
		},
		{
			name:       "valid truthy string '1' returns true",
			key:        "ENABLE_FEATURE",
			envVal:     ptr("1"),
			defaultVal: []bool{false},
			want:       true,
			wantErr:    false,
		},
		{
			name:       "valid falsy string 'false' returns false",
			key:        "ENABLE_FEATURE",
			envVal:     ptr("false"),
			defaultVal: []bool{true},
			want:       false,
			wantErr:    false,
		},
		{
			name:       "valid falsy string '0' returns false",
			key:        "ENABLE_FEATURE",
			envVal:     ptr("0"),
			defaultVal: []bool{true},
			want:       false,
			wantErr:    false,
		},
		{
			name:       "missing key uses optional default value",
			key:        "ENABLE_FEATURE",
			envVal:     nil,
			defaultVal: []bool{true},
			want:       true,
			wantErr:    false,
		},
		{
			name:       "missing key without default value returns error",
			key:        "ENABLE_FEATURE",
			envVal:     nil,
			defaultVal: nil,
			want:       false,
			wantErr:    true,
		},
		{
			name:       "invalid non-boolean env var returns wrapped error",
			key:        "ENABLE_FEATURE",
			envVal:     ptr("invalid_bool"),
			defaultVal: []bool{false},
			want:       false,
			wantErr:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.envVal != nil {
				t.Setenv(tt.key, *tt.envVal)
			} else {
				t.Setenv(tt.key, "")
			}

			got, err := EnvToBool(tt.key, tt.defaultVal...)
			if (err != nil) != tt.wantErr {
				t.Fatalf("EnvToBool() error = %v, wantErr %v", err, tt.wantErr)
			}
			if got != tt.want {
				t.Errorf("EnvToBool() = %v, want %v", got, tt.want)
			}
		})
	}
}
