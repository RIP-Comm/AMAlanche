package dto

// requests
type QaCreateRequest struct {
	Question string `json:"question" binding:"required"`
	ParentId *uint  `json:"parentId"`
}

// response
type QaResponse struct {
	Id        uint         `json:"id"`
	ChannelId uint         `json:"channelId"`
	OwnerId   uint         `json:"ownerId"`
	Username  string       `json:"username"`
	Question  string       `json:"question"`
	Children  []QaResponse `json:"children"`
}
