import { Router, Request, Response, NextFunction } from "express"
import Container from "typedi";
import QuestionService from "../services/question";

const router = Router();


export default (app: Router) => {
    app.use('/questions', router);

    router.route('/')
        .get((req: Request, res: Response, next: NextFunction) => {
            const questionService: QuestionService = Container.get(QuestionService);
            questionService.getAll()
                .then(response => {
                    res.status(200).json({response});
                })
                .catch(err => next(err))
        })
        .post((req: Request, res: Response, next: NextFunction) => {
            const questionService: QuestionService = Container.get(QuestionService);
            questionService.create(req.body)
                .then(response => {
                    res.status(201).json({response})
                })
                .catch(err => next(err))
        })
        .put((req: Request, res: Response, next: NextFunction) => {
            const questionService: QuestionService = Container.get(QuestionService);
            questionService.update(req.body)
                .then(response => {
                    res.status(200).json({response});
                })
                .catch(err => next(err))
        });

    router.route('/:id')
        .get((req: Request, res: Response, next: NextFunction) => {
            const questionService: QuestionService = Container.get(QuestionService);
            questionService.getById(req.params.id)
                .then(response => {
                    res.status(200).json({response})
                })
                .catch(err => next(err))
        })
        .delete((req: Request, res: Response, next: NextFunction) => {
            const questionService: QuestionService = Container.get(QuestionService);
            questionService.deleteById(req.params.id)
                .then(response => {
                    res.status(204).json({response})
                })
                .catch(err => next(err))
        })

 }