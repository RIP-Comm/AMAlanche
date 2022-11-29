export interface IQuestion {
    _id: string;
    text: string;
    owner: string;
    isPinned: boolean
    createdAt: Date;
  }