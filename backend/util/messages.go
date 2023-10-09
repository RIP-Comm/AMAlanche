package util

import "fmt"

const STARTUP_ERROR = "Error during server startup: %v\n"

func CustomError(err error) {
	panic(fmt.Errorf(STARTUP_ERROR, err))
}
