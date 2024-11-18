import { Router } from 'express'
import { createTask, listTasksByUserId } from '../handlers/tasks.js'
import { validateUserIdParam } from '../middleware/validators.js'
const tasksRouter = Router()

// tasksRouter.get("/tasks/:id", getTask);
tasksRouter.get('/tasks/:userId', validateUserIdParam(), listTasksByUserId)
tasksRouter.post('/tasks', createTask)
// tasksRouter.put("/tasks/:id", validateIdParam(), updateTask);
// tasksRouter.delete("/tasks/:id", validateIdParam(), deleteTask);

export default tasksRouter
