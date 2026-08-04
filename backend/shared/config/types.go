package config

// Params holds the configuration parameters for the application.
type Params struct {
	DB_HOST,
	DB_PORT,
	DB_NAME,
	DB_USER,
	DB_PASSWORD,
	APP_PORT,
	JWT_SECRET string
}
