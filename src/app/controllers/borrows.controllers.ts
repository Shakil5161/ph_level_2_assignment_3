import express, { NextFunction, Request, Response } from 'express';
import { Book } from '../models/books.model';
import { Borrow } from '../models/borrows.model';


export const borrowsRoute = express.Router()

borrowsRoute.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { book: bookId, quantity, dueDate } = req.body;

        const book = await Book.findById(bookId);
        if(!book){
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            });
        } else if ( book.copies < quantity){
            res.status(404).json({
                success: false,
                message: "Not enough copies for Borrowing",
                data: null
            });
        } else {
            book.copies -= quantity;
            if (book.copies === 0) {
                book.available = false;
            }
            await book.save()

            const borrow = await Borrow.create({ book: bookId, quantity, dueDate })
            res.status(201).json({
                success: true,
                message: "Book borrowed successfully",
                data: borrow
            });
        }
    } catch (error) {
        next(error);
    }
});


borrowsRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const borrowRecords= await Borrow.aggregate([

            //stage-1
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            //stage-2
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            //stage-3
            {
                $match: {
                    bookDetails: { $ne: [] }
                }
            },
            // Stage 4: Project final output
            {
                $project: {
                _id: 0,
                book: {
                    title: { $arrayElemAt: ["$bookDetails.title", 0] },
                    isbn: { $arrayElemAt: ["$bookDetails.isbn", 0] }
                },
                    totalQuantity: 1
                }
            }
        ])

        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: borrowRecords
        });

    } catch (error) {
        next(error)
    }
})