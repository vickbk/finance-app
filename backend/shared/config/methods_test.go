package config

import (
	"testing"
)

func TestParams_Validate(t *testing.T) {
	validParams := Params{
		DB_HOST:     "localhost",
		DB_PORT:     "5432",
		DB_NAME:     "finance_db",
		DB_USER:     "postgres",
		DB_PASSWORD: "secretpassword",
		JWT_SECRET:  "supersecretjwtkey32charsminimum",
	}

	tests := []struct {
		name    string
		params  Params
		wantErr bool
		errMsg  string
	}{
		{
			name:    "valid configuration passes",
			params:  validParams,
			wantErr: false,
		},
		{
			name: "missing DB_HOST returns error",
			params: func() Params {
				p := validParams
				p.DB_HOST = ""
				return p
			}(),
			wantErr: true,
			errMsg:  "DB_HOST is required",
		},
		{
			name: "missing JWT_SECRET returns error",
			params: func() Params {
				p := validParams
				p.JWT_SECRET = ""
				return p
			}(),
			wantErr: true,
			errMsg:  "JWT_SECRET is required",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.params.validateParams()

			if tt.wantErr {
				if err == nil {
					t.Errorf("validate() expected error containing %q, got nil", tt.errMsg)
					return
				}
				if err.Error() != tt.errMsg {
					t.Errorf("validate() error = %v, wantErrMsg = %v", err.Error(), tt.errMsg)
				}
			} else {
				if err != nil {
					t.Errorf("validate() unexpected error: %v", err)
				}
			}
		})
	}
}

func TestParams_Validate_MultipleMissing(t *testing.T) {
	emptyParams := Params{}

	err := emptyParams.validateParams()
	if err == nil {
		t.Fatal("expected errors for empty params, got nil")
	}

	// Logs all missing parameters in one shot
	t.Logf("Unified error message:\n%v", err)
}