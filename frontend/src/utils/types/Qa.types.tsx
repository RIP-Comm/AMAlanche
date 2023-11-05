export interface QaDto {
	id: string;
	channelId: string;
	ownerId: string;
	username: string;
	question: string;
	children: QaDto[] | null;
}

export interface CreateQA {
	channelId: string;
	question: string;
	parentId: string | null;
}
