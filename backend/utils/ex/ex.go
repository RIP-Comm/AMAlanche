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
	UserIdNotFoundMessage    = fmt.Sprintf(NotFoundMessage, "UserId")
	ChannelIdNotFoundMessage = fmt.Sprintf(NotFoundMessage, "ChannelId")
)

// Resources
const (
	UserResource    = "User"
	ChannelResource = "Channel"
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

// Channel ex
var ChannelNotFound = CustomError{
	Code:    NotFoundCode,
	Message: fmt.Sprintf(NotFoundMessage, ChannelResource),
}
