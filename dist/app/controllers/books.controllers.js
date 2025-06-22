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
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
exports.booksRoutes = express_1.default.Router();
exports.booksRoutes.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield books_model_1.Book.create(req.body);
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
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.booksRoutes.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = req.query.filter ? { genre: req.query.filter } : {};
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sort === 'desc' ? -1 : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const books = yield books_model_1.Book.find(filter).sort({ [sortBy]: sortOrder }).limit(limit);
        if (books.length) {
            res.status(201).json({
                success: true,
                message: "Book retrieved successfully",
                data: books
            });
        }
        else {
            res.status(201).json({
                success: false,
                message: "We didn't find any Book 🔍",
                data: books.length
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.booksRoutes.get('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield books_model_1.Book.findById(req.params.bookId);
        if (books != null) {
            res.status(201).json({
                success: true,
                message: "Book retrieved successfully",
                data: books
            });
        }
        else {
            res.status(201).json({
                success: false,
                message: "We didn't find any Book 🔍",
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.booksRoutes.put('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updatedBody = req.body;
        const book = yield books_model_1.Book.findByIdAndUpdate(bookId, updatedBody, { new: true });
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            });
        }
        else {
            res.status(201).json({
                success: true,
                message: "Book updated successfully",
                data: book
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.booksRoutes.delete('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield books_model_1.Book.findByIdAndDelete(req.params.bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Book deleted successfully",
                data: null // Set data to null as per requirements
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
