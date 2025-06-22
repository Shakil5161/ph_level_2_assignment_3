"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowsRoute = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
const borrows_model_1 = require("../models/borrows.model");
exports.borrowsRoute = express_1.default.Router();
exports.borrowsRoute.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book: bookId, quantity, dueDate } = req.body;
        const book = yield books_model_1.Book.findById(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            });
        }
        else if (book.copies < quantity) {
            res.status(404).json({
                success: false,
                message: "Not enough copies for Borrowing",
                data: null
            });
        }
        else {
            book.copies -= quantity;
            if (book.copies === 0) {
                book.available = false;
            }
            yield book.save();
            const borrow = yield borrows_model_1.Borrow.create({ book: bookId, quantity, dueDate });
            res.status(201).json({
                success: true,
                message: "Book borrowed successfully",
                data: borrow
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.borrowsRoute.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowRecords = yield borrows_model_1.Borrow.aggregate([
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
                $project: {
                    _id: 0,
                    book: {
                        title: { $arrayElemAt: ["$bookDetails.title", 0] },
                        isbn: { $arrayElemAt: ["$bookDetails.isbn", 0] }
                    },
                    totalQuantity: 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: borrowRecords
        });
    }
    catch (error) {
        next(error);
    }
}));
