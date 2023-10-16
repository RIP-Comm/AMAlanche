package ex

import (
	"fmt"
)

const StartupError = "Error during server startup: %v\n"

// codes
const (
	NoneCode      = "none"
	GenericCode   = "Generic"
	ForbiddenCode = "Forbidden"
	NotFoundCode  = "NotFound"
	ConflictCode  = "Conflict"
)

// messages
const (
	GenericErrorMessage          = "an unexpected ex occurred, unable to continue with the requested operation %v"
	BadCredentialMessage         = "wrong credentials"
	BadRequestInvalidJsonMessage = "Invalid JSON request"
	NotFoundMessage              = "[%s] not found"
	UnauthorizedMessage          = "Unauthorized"
	ForbiddenMessage             = "Forbidden"
	NotImplementedMessage        = "NotImplemented"
)

// Generic message fields
var (
	IdNotFoundMessage = fmt.Sprintf(NotFoundMessage, "ID")
)

// Resources
const (
	UserResource = "User"
)

// Errors
type CustomError struct {
	Code    string
	Message string
}

func (e *CustomError) Error() string {
	return fmt.Sprintf(" [Error] Code %d: %s", e.Code, e.Message)
}

// Generic ex
var NoError = CustomError{
	Code:    NoneCode,
	Message: "No ex",
}

// User ex
var UserNotFound = CustomError{
	Code:    NotFoundCode,
	Message: fmt.Sprintf(NotFoundMessage, UserResource),
}
