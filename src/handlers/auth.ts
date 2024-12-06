import { validationResult } from 'express-validator'
import { eq } from 'drizzle-orm'
import { db } from '../db/db.js'
import { users as usersTable } from '../db/schema/index.js'
import { Response, Request, NextFunction } from 'express'
import { CustomError } from '../lib/custom-error.js'
import { comparePasswords, hashPassword } from '../lib/bcrypt.js'
import { signToken, verifyToken } from '../lib/jwt.js'

async function validate(req: Request, next: NextFunction) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return next(new CustomError(JSON.stringify(result.array()), 400))
  }
}

// The auth endpoint that creates a new user record or logs a user based on an existing record
export async function login(req: Request, res: Response, next: NextFunction) {
  validate(req, next)

  const { email, password } = req.body
  // look up the use record by email
  const user = await db.select().from(usersTable).where(eq(usersTable.email, email))

  if (user.length === 0) {
    next(new CustomError('User does not exist', 400))
  }
  // if the user exists, compare the hashed passwords and generate a JWT token
  if (user.length > 0) {
    comparePasswords(password, user[0].password, (err, result) => {
      if (err) {
        next(new CustomError(`Invalid password: ${err.message}`, 500))
      } else if (result) {
        const loginData = {
          email,
          signInTime: Date.now()
        }

        const token = signToken(loginData)

        res.status(200).json({ message: 'success', token })
      } else {
        next(new CustomError('Passwords do not match', 401))
      }
    })
  }
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body

  console.log('signup', req.body)
  hashPassword(password, async (_err, hash) => {
    try {
      const user = await db
        .insert(usersTable)
        .values({ ...req.body, password: hash })
        .returning()

      console.log('user', user)

      const loginData = {
        email,
        signInTime: Date.now()
      }

      const token = signToken(loginData)

      res.status(200).json({ message: 'success', token })
    } catch (error) {
      console.log('error', error)
      next(new CustomError(`Failed to add user: ${error?.detail}`, 500))
    }
  })
}

// The verify endpoint that checks if a given JWT token is valid
export async function verifyAuthToken(req: Request, res: Response, next: NextFunction) {
  const tokenHeaderKey = 'jwt-token'
  const authToken = req.headers[tokenHeaderKey] as string

  try {
    const verified = verifyToken(authToken)

    if (verified) {
      res.status(200).json({ status: 'logged in', message: 'success' })
    } else {
      // Access denied
      res.status(401).json({ status: 'unauthorized', message: 'error' })
    }
  } catch (error) {
    next(new CustomError(error.message, 401))
  }
}

// An endpoint to see if there's an existing account for a given email address
export async function checkAccount(req: Request, res: Response, next: NextFunction) {
  console.log('checking account')
  const { email } = req.body

  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email))

    res.status(200).json({
      status: user.length ? 'User exists' : 'User does not exist',
      userExists: user.length === 1
    })
  } catch (error) {
    next(new CustomError(error.message, 401))
  }
}
