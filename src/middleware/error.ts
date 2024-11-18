import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../lib/custom-error.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function error(err: CustomError, req: Request, res: Response, _next: NextFunction) {
  try {
    const msg = JSON.parse(err.message)
    return res.status(err.status).json({ message: msg })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return res.status(err.status).json({ message: err.message })
  }
}
