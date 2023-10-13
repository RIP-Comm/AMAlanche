package utils

import (
	"fmt"
)

const StartupError = "Error during server startup: %v\n"

const (
	GenericErrorMessage          = "an unexpected error occurred, unable to continue with the requested operation %v"
	BadRequestInvalidJsonMessage = "Invalid JSON request"
	NotFoundMessage              = "[%s] not found"
)

// Generic fields
var IdNotFoundMessage = fmt.Sprintf(NotFoundMessage, "ID")

// User
const UserResource = "User"

var UserNotFound = fmt.Errorf(NotFoundMessage, UserResource)
