import { model, Schema, Model } from 'mongoose';
import { IQuestion } from '../interfaces/question';

const questionCollection = 'questions';
const QuestionSchema: Schema = new Schema(
    {
        text: { type: String, required: true },
        upvotes: { type: Number, required: true, default: 0 },
        owner: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
        //will be integrated with issue: https://github.com/RIP-Comm/AMAlanche/issues/15 
        //session: { type: String, required: true },
        isPinned: { type: Boolean, default: false },
        createdAt: { type: Date, required: true, default: Date.now() }
    }
);

const Question: Model<IQuestion> = model('Question', QuestionSchema, questionCollection) as Model<IQuestion>;

export default Question;