import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { ErrorResponse } from '~types';

export const validateAuthBody = (schema: yup.ObjectSchema<any>) => {
  return async (req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
    try {
      req.body = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const response = { error: error.errors[0] };
        return res.status(400).json(response);
      }
      next(error);
    }
  };
};