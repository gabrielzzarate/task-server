import express, { urlencoded, json } from 'express'
import cors from 'cors'
import { notFound } from './middleware/not-found.js'
import bodyParser from 'body-parser'
import { error } from './middleware/error.js'
import usersRouter from './routes/users.js'
import tasksRouter from './routes/tasks.js'
import authRouter from './routes/auth.js'
import session from 'express-session'

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(bodyParser.json())

app.use(
  cors({
    origin: process.env.CLIENT_URL
  })
)
app.use(
  session({
    secret: process.env.JWT_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true
    }
  })
)
app.use('/api', authRouter)
app.use('/api', usersRouter)
app.use('/api', tasksRouter)

app.use(notFound)
app.use(error)

export default app
