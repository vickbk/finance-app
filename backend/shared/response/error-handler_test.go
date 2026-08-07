package response

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v3"

	"github.com/vickbk/finance-app/backend/shared/response/modules/errors"
)

func TestErrorHandler(t *testing.T) {
	app := fiber.New(fiber.Config{
		ErrorHandler: ErrorHandler,
	})

	app.Get("/domain-err", func(c fiber.Ctx) error {
		return errors.NotFound("Account not found")
	})

	app.Get("/fiber-err", func(c fiber.Ctx) error {
		return fiber.NewError(http.StatusBadRequest, "Invalid JSON payload")
	})

	app.Get("/internal-err", func(c fiber.Ctx) error {
		return errors.Internal("database connection timeout")
	})

	tests := []struct {
		name         string
		path         string
		expectedCode int
		expectedSlug string
	}{
		{
			name:         "formats custom domain error into response envelope",
			path:         "/domain-err",
			expectedCode: http.StatusNotFound,
			expectedSlug: "NOT_FOUND",
		},
		{
			name:         "formats native fiber error into response envelope",
			path:         "/fiber-err",
			expectedCode: http.StatusBadRequest,
			expectedSlug: "Bad Request",
		},
		{
			name:         "handles unhandled 404 route in standard envelope",
			path:         "/not-exist",
			expectedCode: http.StatusNotFound,
			expectedSlug: "Not Found",
		},
		{
			name:         "sanitizes internal server error",
			path:         "/internal-err",
			expectedCode: http.StatusInternalServerError,
			expectedSlug: "INTERNAL_ERROR",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, tt.path, nil)
			resp, err := app.Test(req)
			if err != nil {
				t.Fatalf("failed to execute request: %v", err)
			}
			defer func() {
				_ = resp.Body.Close()
			}()

			if resp.StatusCode != tt.expectedCode {
				t.Errorf("expected HTTP status %d, got %d", tt.expectedCode, resp.StatusCode)
			}

			body, err := io.ReadAll(resp.Body)
			if err != nil {
				t.Fatalf("failed to read response body: %v", err)
			}

			var env APIResponse[any]
			if err := json.Unmarshal(body, &env); err != nil {
				t.Fatalf("failed to parse JSON response envelope: %v. Body: %s", err, string(body))
			}

			if env.Success {
				t.Errorf("expected success: false in error envelope, got true")
			}

			if env.Error == nil {
				t.Fatal("expected error field in envelope, got nil")
			}

			if env.Meta != tt.expectedSlug {
				t.Errorf("expected error code slug %q, got %q", tt.expectedSlug, env.Meta)
			}

			if env.Error.Code != tt.expectedCode {
				t.Errorf("expected error code to be %d, got %d", tt.expectedCode, env.Error.Code)
			}
		})
	}
}
