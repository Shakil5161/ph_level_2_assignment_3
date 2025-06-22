"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controllers_1 = require("./app/controllers/books.controllers");
const borrows_controllers_1 = require("./app/controllers/borrows.controllers");
const errorHandler_1 = require("./app/middlewares/errorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/books', books_controllers_1.booksRoutes);
app.use('/api/borrow', borrows_controllers_1.borrowsRoute);
app.get('/', (req, res) => {
    res.send('Welcome to our Library Management System');
});
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        error: {
            path: req.originalUrl
        }
    });
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
