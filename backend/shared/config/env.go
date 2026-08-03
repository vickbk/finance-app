package config

import (
	"os"
)

var ENV = Params{}

func init() {
	initialize()
}

func getEnv(key string, optional ...string) string {
	if val, exists := os.LookupEnv(key); exists && val != "" {
		return val
	}
	if len(optional) > 0 {
		return optional[0]
	}
	return ""
}
