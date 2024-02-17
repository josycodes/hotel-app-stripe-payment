import express from 'express';
import httpContext from 'express-http-context';
import LoggerLib from '../libs/Logger.lib.js';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();
const router = express.Router();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: '*'
}));

// Use httpContext middleware for managing context data
app.use(httpContext.middleware);

// Custom middleware to set request ID and log API requests
app.use((req, res, next) => {
    // Generate and set a unique request ID
    httpContext.set('request-id', uuidv4().toString());

    // Log API request
    LoggerLib.log('API Request:', {
        url: req.url,
        method: req.method,
        request: req.body
    });

    next(); // Call the next middleware
});

export { app, router };
