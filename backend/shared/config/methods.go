package config

import (
	"errors"
)

func (params Params) validateParams() error {
	requiredRules := []struct {
		value string
		msg   string
	}{
		{params.DB_HOST, "DB_HOST is required"},
		{params.DB_PORT, "DB_PORT is required"},
		{params.DB_NAME, "DB_NAME is required"},
		{params.DB_USER, "DB_USER is required"},
		{params.DB_PASSWORD, "DB_PASSWORD is required"},
		{params.JWT_SECRET, "JWT_SECRET is required"},
	}

	var errs []error

	for _, rule := range requiredRules {
		if rule.value == "" {
			errs = append(errs, errors.New(rule.msg))
		}
	}

	return errors.Join(errs...)
}
