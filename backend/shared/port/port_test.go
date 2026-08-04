package port

import (
	"errors"
	"testing"
)

func TestIsValid(t *testing.T) {
	tests := []struct {
		name string
		port int
		want bool
	}{
		{"below lower bound", 1023, false},
		{"exact lower bound", 1024, true},
		{"standard application port", 8080, true},
		{"exact upper bound", 65535, true},
		{"above upper bound", 65536, false},
		{"negative port", -1, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := IsValid(tt.port); got != tt.want {
				t.Errorf("IsValid(%d) = %v; want %v", tt.port, got, tt.want)
			}
		})
	}
}

func TestValidate(t *testing.T) {
	if err := Validate(8080); err != nil {
		t.Errorf("expected valid port, got error: %v", err)
	}

	err := Validate(80)
	if err == nil {
		t.Fatal("expected error for privileged port 80, got nil")
	}
	if !errors.Is(err, ErrInvalidPort) {
		t.Errorf("expected ErrInvalidPort, got %v", err)
	}
}