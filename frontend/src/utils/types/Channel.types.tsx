import { QaDto } from './Qa.types';

export interface Channel {
	id: string;
	name: string;
	ownerId: string;
	qas: QaDto[];
}

export interface CreateChannel {
	name: string;
}
