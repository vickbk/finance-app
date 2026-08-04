package config

import "testing"

func TestEnvToInt(t *testing.T) {
	tests := []struct {
		name       string
		key        string
		envVal     *string
		defaultVal []int
		want       int
		wantErr    bool
	}{
		{
			name:       "valid integer env var returns parsed int",
			key:        "APP_PORT",
			envVal:     ptr("8080"),
			defaultVal: []int{3000},
			want:       8080,
			wantErr:    false,
		},
		{
			name:       "missing key uses optional default value",
			key:        "APP_PORT",
			envVal:     nil,
			defaultVal: []int{3000},
			want:       3000,
			wantErr:    false,
		},
		{
			name:       "missing key without default value returns error",
			key:        "APP_PORT",
			envVal:     nil,
			defaultVal: nil,
			want:       0,
			wantErr:    true,
		},
		{
			name:       "invalid non-numeric env var returns wrapped strconv error",
			key:        "APP_PORT",
			envVal:     ptr("not_a_number"),
			defaultVal: []int{3000},
			want:       0,
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

			got, err := EnvToInt(tt.key, tt.defaultVal...)
			if (err != nil) != tt.wantErr {
				t.Fatalf("EnvToInt() error = %v, wantErr %v", err, tt.wantErr)
			}
			if got != tt.want {
				t.Errorf("EnvToInt() = %d, want %d", got, tt.want)
			}
		})
	}
}
