import { validationResult } from 'express-validator'
import { eq } from 'drizzle-orm'
import { db } from '../db/db.js'
import { usersTable } from '../db/schema.js'
import { Response, Request, NextFunction } from 'express'
import { CustomError } from '../lib/custom-error.js'

async function validate(req: Request, next: NextFunction) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return next(new CustomError(JSON.stringify(result.array()), 400))
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  validate(req, next)
  try {
    const user = await db.insert(usersTable).values(req.body).returning()
    res.status(201).json({ user })
  } catch (error) {
    next(new CustomError(`Failed to add user: ${error?.detail}`, 500))
  }
}

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await db.select().from(usersTable)
    res.status(200).json({ users })
  } catch (error) {
    next(new CustomError(`Failed to fetch users: ${error.message}`, 500))
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, +req.params.id))
    res.status(200).json({ user })
  } catch (error) {
    next(new CustomError(`Failed to fetch user: ${error.message}`, 500))
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  validate(req, next)
  try {
    const user = await db.delete(usersTable).where(eq(usersTable.id, +req.params.id)).returning({
      deletedUserId: usersTable.id
    })
    res.status(200).json({ user })
  } catch (error) {
    next(new CustomError(`Failed to delete user: ${error.message}`, 500))
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  validate(req, next)
  try {
    const user = await db
      .update(usersTable)
      .set(req.body)
      .where(eq(usersTable.id, +req.params.id))
      .returning()

    res.status(201).json({ user })
  } catch (error) {
    next(new CustomError(`Failed to update user: ${error.message}`, 500))
  }
}
