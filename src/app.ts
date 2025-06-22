import express, { Application, NextFunction, Request, Response } from "express";
import { booksRoutes } from "./app/controllers/books.controllers";
import { borrowsRoute } from "./app/controllers/borrows.controllers";
import { errorHandler } from "./app/middlewares/errorHandler";


const app: Application = express();
app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/borrow', borrowsRoute);



app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to our Library Management System');
})

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        error: {
            path: req.originalUrl
        }
    });
});

app.use(errorHandler)

export default app;