import express, { NextFunction, Request, Response } from 'express';
import { Book } from '../models/books.model';


export const booksRoutes = express.Router();
booksRoutes.post("/", async(req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await Book.create(req.body);

        const bookData = {
            _id: book._id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            isbn: book.isbn,
            description: book.description,
            copies: book.copies,
            available: book.available,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt
        };
        
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: bookData
        })
    } catch (error) {
        next(error);
    }
})

// booksRoutes.get("/", async(req: Request, res: Response, next: NextFunction) => {
//     try {
//         const filter = req.query.filter ? { genre: req.query.filter } : {};
//         const sortBy = (req.query.sortBy as string) || 'createdAt';
//         const sortOrder = req.query.sort === 'desc' ? -1 : 1;
//         const limit = req.query.limit ? Number(req.query.limit) : 50;

    
//         const books = await Book.find(filter).sort({ [sortBy]: sortOrder }).limit(limit);

//         if(books.length){
//             res.status(201).json({
//                 success: true,
//                 message: "Book retrieved successfully",
//                 data: books
//             })
//         } else {
//             res.status(201).json({
//                 success: false,
//                 message: "We didn't find any Book 🔍",
//                 data: books.length
//             })
//         }
//     } catch (error) {
//         next(error);
//     }
    
// })

booksRoutes.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.query.filter ? { genre: req.query.filter } : {};
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortA = req.query.sort === 'asc' || req.query.sort === 'desc' ? req.query.sort : 'desc';
    const sortOrder = sortA === 'desc' ? -1 : 1;

    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const skip = (page - 1) * limit;

    // Count total books for pagination meta
    const total = await Book.countDocuments(filter);

    // Get paginated results
    const books = await Book.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully 📚",
      data: books,
      meta: {
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
});


booksRoutes.get('/:bookId', async(req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await Book.findById(req.params.bookId);
        if( books != null ){
            res.status(201).json({
                success: true,
                message: "Book retrieved successfully",
                data: books
            })
        } else {
            res.status(201).json({
                success: false,
                message: "We didn't find any Book 🔍",
            })
        }
        
    } catch (error) {
        next(error)
    }
})

booksRoutes.put('/:bookId', async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const bookId = req.params.bookId;
        const updatedBody = req.body;
        const book = await Book.findByIdAndUpdate(bookId, updatedBody, {new: true});
        if (!book) {
            res.status(404).json({
               success: false,
               message: "Book not found",
               data: null
           });
       } else {
            res.status(201).json({
                success: true,
                message: "Book updated successfully",
                data: book
            })
       }
        
        
    } catch (error) {
        next(error)
    }
})

booksRoutes.delete('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.bookId);
        if (!book) {
             res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Book deleted successfully",
                data: null // Set data to null as per requirements
            });
        }
    } catch (error) {
        next(error)
    }
})