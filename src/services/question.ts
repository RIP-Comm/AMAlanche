import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { IQuestion } from "../interfaces/question";
import Question from "../models/question";
import { CustomError } from "../utils/response/custom-error/CustomError";

@Service()
export default class QuestionService {
    constructor(@Inject('logger') private logger: Logger) {}

    public async getAll(): Promise<IQuestion[]> {
        return await Question.find({});
    }

    public async getById(id: string): Promise<IQuestion> {
        const entity: IQuestion = await Question.findById<IQuestion>(id);

        if(!entity) {
            this.logger.error(`question with id ${entity._id} not found!`);
            throw new CustomError(404, "Raw", "Entity not found!");
        }

        this.logger.info(`question found: ${entity._id}`);
        return entity;
    }
    
    public async create(question: IQuestion): Promise<IQuestion> {
        const entity = await Question.create(question);
        this.logger.info(`question created with id: ${entity._id}`);
        return entity;
    }

    public async update(question: IQuestion): Promise<IQuestion> {
        const entity = await Question.findOneAndUpdate({_id: question._id}, question, { runValidators: true });
        
        if(!entity) {
            this.logger.error(`question with id ${entity._id} not found!`);
            throw new CustomError(404, "Raw", "Entity not found!");
        }

        this.logger.info(`question updated with id: ${entity._id}`);
        return entity;
    }

    public async deleteById(id: string): Promise<IQuestion> {
        const entity = await Question.findOneAndDelete({_id: id})

        if(!entity) {
            this.logger.error(`question with id ${entity._id} not found!`);
            throw new CustomError(404, "Raw", "Entity not found!");
        }

        this.logger.info(`question deleted with id: ${entity._id}`);
        return entity;
    }
}