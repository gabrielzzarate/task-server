import { eq } from 'drizzle-orm'
import { tasksTable, InsertTask } from '../db/schema.js'
import { db } from '../db/db.js'
import { Response, Request, NextFunction } from 'express'
import { CustomError } from '../lib/custom-error.js'

export async function createTask(req: Request, res: Response, next: NextFunction) {
  const body = req.body as InsertTask
  try {
    const task = await db.insert(tasksTable).values(body).returning()
    res.status(201).json({ task })
  } catch (error) {
    console.log('error', error)
    next(new CustomError('Failed to add task', 500))
  }
}

export async function listTasksByUserId(req: Request, res: Response, next: NextFunction) {
  const userId = req.params.userId && +req.params.userId

  console.log('userId', userId)

  try {
    const tasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, userId))
    res.status(200).json({ tasks })
  } catch (error) {
    console.log('error', error)
    next(new CustomError(`Failed to fetch tasks ${error?.detail ?? ''}`, 500))
  }
}

// export async function getTask(req: Request, res: Response, next: NextFunction) {
//   try {
//     const task = await db
//       .select()
//       .from(tasksTable)
//       .where(tasksTable.id.eq(+req.params.id));
//     res.status(200).json({ task });
//   } catch (error) {
//     next(new CustomError("Failed to fetch task", 500));
//   }
// }

// export async function deleteTask(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const task = await db
//       .delete(tasksTable)
//       .where(tasksTable.id.eq(+req.params.id))
//       .returning({
//         deletedTaskId: tasksTable.id,
//       });
//     res.status(200).json({ task });
//   } catch (error) {
//     next(new CustomError("Failed to delete task", 500));
//   }
// }

// export async function updateTask(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const task = await db
//       .update(tasksTable)
//       .set(req.body)
//       .where(tasksTable.id.eq(+req.params.id))
//       .returning();

//     res.status(201).json({ task });
//   } catch (error) {
//     next(new CustomError("Failed to update task", 500));
//   }
// }
