/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'
import { body, param } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

//Validating and sanitizing title from request body
export function validateUserName() {
  return body('name').notEmpty().isString().trim().escape()
}

//Validating and sanitizing body from request body
export function validateUserEmail() {
  return body('email').notEmpty().isString().trim().escape()
}

//Validating id from route parameter
export function validateIdParam() {
  return param('id').toInt().isInt()
}

export function validateUserIdParam() {
  return param('userId').toInt().isInt()
}

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`
        }))
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Invalid data',
          errors: errorMessages
        })
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' })
      }
    }
  }
}
