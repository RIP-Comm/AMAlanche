package utils

import "strconv"

func StrToUint(idStr string) (uint, error) {
	idUint64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return 0, err
	}

	result := uint(idUint64)

	return result, nil
}
