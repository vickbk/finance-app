package response_test

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v3"

	"github.com/vickbk/finance-app/backend/shared/response"
)

type user struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
}

type pageMeta struct {
	Page  int `json:"page"`
	Limit int `json:"limit"`
	Total int `json:"total"`
}

func TestSuccess(t *testing.T) {
	app := fiber.New()

	app.Get("/default-status", func(c fiber.Ctx) error {

		return response.Success(c, user{ID: 1, Email: "user@example.com"})
	})

	app.Post("/custom-status", func(c fiber.Ctx) error {

		return response.Success(c, user{ID: 2, Email: "created@example.com"}, http.StatusCreated)
	})

	tests := []struct {
		name         string
		method       string
		path         string
		expectedCode int
		expectedUser user
	}{
		{
			name:         "returns 200 OK with default status code and payload",
			method:       http.MethodGet,
			path:         "/default-status",
			expectedCode: http.StatusOK,
			expectedUser: user{ID: 1, Email: "user@example.com"},
		},
		{
			name:         "returns custom status code 201 Created",
			method:       http.MethodPost,
			path:         "/custom-status",
			expectedCode: http.StatusCreated,
			expectedUser: user{ID: 2, Email: "created@example.com"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(tt.method, tt.path, nil)
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

			var env response.APIResponse[user]
			if err := json.Unmarshal(body, &env); err != nil {
				t.Fatalf("failed to unmarshal JSON envelope: %v. Body: %s", err, string(body))
			}

			if !env.Success {
				t.Errorf("expected success: true, got false")
			}

			if env.Data != tt.expectedUser {
				t.Errorf("expected data %+v, got %+v", tt.expectedUser, env.Data)
			}

			if env.Error != nil {
				t.Errorf("expected error field to be nil, got %+v", env.Error)
			}

			if env.Meta != nil {
				t.Errorf("expected meta field to be nil, got %+v", env.Meta)
			}
		})
	}
}

func TestSuccessWithMeta(t *testing.T) {
	app := fiber.New()

	meta := pageMeta{Page: 1, Limit: 10, Total: 100}

	app.Get("/meta-default", func(c fiber.Ctx) error {
		users := []user{{ID: 1, Email: "user1@example.com"}}
		return response.SuccessWithMeta(c, users, meta)
	})

	app.Get("/meta-custom-status", func(c fiber.Ctx) error {
		users := []user{{ID: 1, Email: "user1@example.com"}}
		return response.SuccessWithMeta(c, users, meta, http.StatusAccepted)
	})

	tests := []struct {
		name         string
		path         string
		expectedCode int
	}{
		{
			name:         "returns 200 OK with payload and metadata",
			path:         "/meta-default",
			expectedCode: http.StatusOK,
		},
		{
			name:         "returns custom status code 202 Accepted with metadata",
			path:         "/meta-custom-status",
			expectedCode: http.StatusAccepted,
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

			var env response.APIResponse[[]user]
			if decodeErr := json.Unmarshal(body, &env); decodeErr != nil {
				t.Fatalf("failed to unmarshal JSON envelope: %v. Body: %s", decodeErr, string(body))
			}

			if !env.Success {
				t.Errorf("expected success: true, got false")
			}

			if len(env.Data) != 1 || env.Data[0].Email != "user1@example.com" {
				t.Errorf("unexpected data content: %+v", env.Data)
			}

			if env.Meta == nil {
				t.Fatal("expected meta field to be non-nil, got nil")
			}

			// Convert meta map/struct to verify fields
			metaBytes, err := json.Marshal(env.Meta)
			if err != nil {
				t.Fatalf("failed to marshal meta field: %v", err)
			}

			var parsedMeta pageMeta
			if err := json.Unmarshal(metaBytes, &parsedMeta); err != nil {
				t.Fatalf("failed to parse meta field back to PageMeta: %v", err)
			}

			if parsedMeta != meta {
				t.Errorf("expected meta %+v, got %+v", meta, parsedMeta)
			}

			if env.Error != nil {
				t.Errorf("expected error field to be nil, got %+v", env.Error)
			}
		})
	}
}
