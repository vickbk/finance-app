package errors

func (e *AppError) Unwrap() error {
	return e.Err
}
