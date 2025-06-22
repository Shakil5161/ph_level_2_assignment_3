import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    console.log(err, 'Error')
    if (err instanceof mongoose.Error.ValidationError) {
        const formattedErrors = Object.keys(err.errors).reduce((acc, key) => {
            const error = err.errors[key];
            if (error instanceof mongoose.Error.ValidatorError) {
                console.log(error, 'error')
                const customMessage =  error.kind === "min" ? "Copies must be a positive number" : error.message;

                acc[key] = {
                    message: customMessage,
                    name: error.name,
                    properties: {
                        message: customMessage, 
                        type: error.properties.type, 
                        min: 'min' in error.properties ? error.properties.min : null
                    },
                    kind: error.kind,
                    path: error.path,
                    value: error.value
                };
            } else {
                acc[key] = {
                    message: error.message,
                    name: error.name,
                    kind: error.kind,
                    path: error.path,
                    value: error.value
                };
            }
            return acc;
        }, {} as Record<string, any>);

        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: {
                name: err.name,
                errors: formattedErrors
            }
        });
        return; 
    }
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: err
    });
    return; 
};