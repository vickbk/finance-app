package server

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSetupApp(t *testing.T) {
	app, _, _ := SetupApp("Test App")

	t.Run("returns 404 for undefined routes", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/non-existent", nil)
		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("app.Test failed: %v", err)
		}

		if resp.StatusCode != http.StatusNotFound {
			t.Errorf("expected status %d, got %d", http.StatusNotFound, resp.StatusCode)
		}
	})
}
