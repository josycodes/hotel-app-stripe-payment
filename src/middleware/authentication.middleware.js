import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import AuthService from '../services/auth.service';
import CacheAdapter from '../adapters/CacheAdapter';
import ErrorLib, { NotFound } from '../libs/Error.lib';
import { db } from '../db/connect';

// TODO: tidy this up pls!

export const authorizeRequest = async (req, res, next) => {
    try {
        const { id, token } = await tokenValidator(req);
        const existing = await new CacheAdapter().get(`auth:student:${id}`);
        if (existing !== CryptoJS.MD5(token).toString()) throw new ErrorLib('unauthorized device', 401, 'token hash does not match');
        req.user = {id};
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof NotFound) {
            next(new ErrorLib('unauthorized', 401, error.message))
        } else {
            next(error)
        }
    }
}

export const authorizeRegRequest = async (req, res, next) => {
    try {
        const { id, token } = await tokenValidator(req);
        const existing = await new CacheAdapter().get(`auth:jamb:${id}`);
        if (existing !== CryptoJS.MD5(token).toString()) throw new ErrorLib('unauthorized device', 401, 'token hash does not match');
        req.user = { jamb_number: id };
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof NotFound) {
            next(new ErrorLib('unauthorized', 401, error.message))
        } else {
            next(error)
        }
    }
}

export const authorizeStaffRequest = async (req, res, next) => {
    try {
        const { id, token } = await tokenValidator(req);
        const existing = await new CacheAdapter().get(`auth:staff:${id}`);
        if (existing !== CryptoJS.MD5(token).toString()) throw new ErrorLib('unauthorized device', 401, 'token hash does not match');
        const user = await AuthService.getUserById(id, db.Staff);
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof NotFound) {
            next(new ErrorLib('unauthorized', 401, error.message))
        } else {
            next(error)
        }
    }
}

export const authorizeInstituteRequest = async (req, res, next) => {
    try {
        const { id, token } = await tokenValidator(req);
        const existing = await new CacheAdapter().get(`auth:institute:${id}`);
        if (existing !== CryptoJS.MD5(token).toString()) throw new ErrorLib('unauthorized device', 401, 'token hash does not match');
        const user = await  AuthService.getUserById(id, db.InstitutionStaff);
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof NotFound) {
            next(new ErrorLib('unauthorized', 401, error.message))
        } else {
            next(error)
        }
    }
}

export const authorizeAdminRequest = async (req, res, next) => {
    try {
        const { id, token } = await tokenValidator(req);
        const existing = await new CacheAdapter().get(`auth:admin:${id}`);
        if (existing !== CryptoJS.MD5(token).toString()) throw new ErrorLib('unauthorized device', 401, 'token hash does not match');
        req.user = {id};
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof NotFound) {
            next(new ErrorLib('unauthorized', 401, error.message))
        } else {
            next(error)
        }
    }
}

export const tokenRequestAuthorization = async (req, res, next) => {
    try {
        const { id }= await tokenValidator(req, res, next);
        req.decodedData =  { id }
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof NotFound) {
            next(new ErrorLib('unauthorized', 401, error.message))
        } else {
            next(error)
        }
    }
}

const tokenValidator = async (req) => {
    if (!Boolean(req.body.token)){
        if (req.headers.authorization?.split(' ')[0].toLowerCase() !== 'bearer') throw new ErrorLib('unauthorized', 401, 'no bearer type')
        // throw new ErrorLib('unauthorized', 401, 'no token provided')
    }
    const token = req.headers.authorization?.split(' ')[1] || req.body.token;
    if (!token) throw new ErrorLib('unauthorized', 401, 'no token');

    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    return { id, token };
}

export const isStudent = async (req, res, next) => {};
