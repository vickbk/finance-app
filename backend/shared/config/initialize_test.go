package config

import (
	"os"
	"path/filepath"
	"testing"
)

// Unpack joined errors to verify exact count

type unwrapper interface{ Unwrap() []error }

func TestInitialize_SystemEnvironmentVariables(t *testing.T) {
	// t.Setenv automatically cleans up environment variables when the test finishes
	t.Setenv("DB_HOST", "sys-db-host")
	t.Setenv("DB_PORT", "5432")
	t.Setenv("DB_NAME", "sys_db")
	t.Setenv("DB_USER", "sys_user")
	t.Setenv("DB_PASSWORD", "test_pass")
	t.Setenv("JWT_SECRET", "sys_jwt_secret")

	// Trigger initialization targeting a non-existent .env file
	initialize("non_existent_.env")

	if ENV.DB_HOST != "sys-db-host" {
		t.Errorf("expected DB_HOST 'sys-db-host', got %q", ENV.DB_HOST)
	}
	if ENV.JWT_SECRET != "sys_jwt_secret" {
		t.Errorf("expected JWT_SECRET 'sys_jwt_secret', got %q", ENV.JWT_SECRET)
	}
}

func TestInitialize_LoadsFromDotEnvFile(t *testing.T) {

	// 1. Create a temporary directory and temporary .env file
	tempDir := t.TempDir()
	envPath := filepath.Join(tempDir, ".env.test")

	dotenvContent := `
DB_HOST=file-db-host
DB_PORT=5433
DB_NAME=file_db
DB_USER=file_user
DB_PASSWORD=file_pass
JWT_SECRET=file_jwt_secret
`
	if err := os.WriteFile(envPath, []byte(dotenvContent), 0644); err != nil {
		t.Fatalf("failed to create temporary .env file: %v", err)
	}

	keys := []string{"DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD", "JWT_SECRET"}
	for _, k := range keys {
		// Preserve environment state for cleanup after test
		if orig, ok := os.LookupEnv(k); ok {
			t.Cleanup(func() { os.Setenv(k, orig) })
		} else {
			t.Cleanup(func() { os.Unsetenv(k) })
		}
		os.Unsetenv(k)
	}

	// 3. Execute initialize using the temp file
	initialize(envPath)

	if ENV.DB_HOST != "file-db-host" {
		t.Errorf("expected DB_HOST 'file-db-host', got %q", ENV.DB_HOST)
	}
	if ENV.DB_PORT != "5433" {
		t.Errorf("expected DB_PORT '5433', got %q", ENV.DB_PORT)
	}
	if ENV.JWT_SECRET != "file_jwt_secret" {
		t.Errorf("expected JWT_SECRET 'file_jwt_secret', got %q", ENV.JWT_SECRET)
	}
}

func TestParams_Validate_UnifiedError(t *testing.T) {
	tests := []struct {
		name      string
		params    map[string]string
		wantCount int
	}{
		{
			name: "all valid - zero errors",
			params: map[string]string{
				"DB_HOST":     "localhost",
				"DB_PORT":     "5432",
				"DB_NAME":     "finance_db",
				"DB_USER":     "postgres",
				"DB_PASSWORD": "password",
				"JWT_SECRET":  "secret",
			},
			wantCount: 0,
		},
		{
			name: "missing two fields - returns joined error",
			params: map[string]string{
				"DB_HOST":     "",
				"DB_PORT":     "5432",
				"DB_NAME":     "finance_db",
				"DB_USER":     "postgres",
				"DB_PASSWORD": "password",
				"JWT_SECRET":  "",
			},
			wantCount: 2,
		},
		{
			name: "all missing fields - returns 6 joined errors",
			params: map[string]string{
				"DB_HOST":     "",
				"DB_PORT":     "",
				"DB_NAME":     "",
				"DB_USER":     "",
				"DB_PASSWORD": "",
				"JWT_SECRET":  "",
			},
			wantCount: 6,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			for k, v := range tt.params {
				if v == "" {
					os.Unsetenv(k)
				} else {
					os.Setenv(k, v)
				}
			}

			err := initialize()

			if tt.wantCount == 0 {
				if err != nil {
					t.Errorf("expected nil error, got: %v", err)
				}
				return
			}

			if err == nil {
				t.Fatalf("expected error, got nil")
			}

			if u, ok := err.(unwrapper); ok {
				gotCount := len(u.Unwrap())
				if gotCount != tt.wantCount {
					t.Errorf(
						"expected %d sub-errors, got %d. Errors: %v",
						tt.wantCount, gotCount, u.Unwrap(),
					)
				}
			} else {
				t.Errorf("expected joined error implementing Unwrap() []error")
			}
		})
	}
}
