import { Router } from 'express'
import { createUser, listUsers, getUser, deleteUser, updateUser } from '../handlers/users.js'
import { validateIdParam, validateUserName, validateUserEmail } from '../middleware/validators.js'

const usersRouter = Router()

usersRouter.get('/users/:id', validateIdParam(), getUser)
usersRouter.get('/users', listUsers)
usersRouter.post('/users', validateUserName(), validateUserEmail(), createUser)
usersRouter.put('/users/:id', validateIdParam(), validateUserName(), updateUser)
usersRouter.delete('/users/:id', validateIdParam(), deleteUser)

export default usersRouter
