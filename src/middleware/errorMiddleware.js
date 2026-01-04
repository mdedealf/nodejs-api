import { Prisma } from "@prisma/client";

/**
 * 404 Not Found Handler Middleware
 * Creates an error for routes that don't exist and passes it to the next error handler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

/**
 * Global error handler Middleware
 * Handles all errors in the application and send appropriate responses.
 * Provides detailed error information in development mode, and limited information in production.
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    err.statusCode = 400;
    err.message = "Invalid data provided";
  }

  // Handle Prisma unique constraint violations
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const field = err.meta?.target?.[0] || "field";
      err.statusCode = 400;
      err.message = `${field} already exists`;
    }

    // Handle Prisma record not found errors
    if (err.code === "P2025") {
      err.statusCode = 404;
      err.message = "Record not found";
    }
  }

  // Handle Prisma foreign key constraint violations
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2003") {
      err.statusCode = 400;
      err.message = "Invalid refrence: related record does not exist";
    }
  }

  // Send error response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // Only include stack trace in development mode
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export { notFound, errorHandler };
