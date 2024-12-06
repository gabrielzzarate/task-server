import { Router } from 'express'
import { validateData } from '../middleware/validators.js'
import { userLoginSchema } from '../schemas/userSchema.js'
import { login, signup, verifyAuthToken, checkAccount } from '../handlers/auth.js'

const authRouter = Router()

// todo: add auth middleware

// create and login users and issue JWT tokens
authRouter.post('/auth/signup', signup)
authRouter.post('/auth/login', validateData(userLoginSchema), login)
authRouter.post('/auth/verify', verifyAuthToken)
authRouter.post('/auth/check-account', checkAccount)

export default authRouter
