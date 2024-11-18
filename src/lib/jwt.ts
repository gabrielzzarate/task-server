import jwt from 'jsonwebtoken'
import { JWT_SECRET as SECRET } from './env.js'

const twentyFourHours = 24 * 60 * 60 * 1000

interface TokenPayload {
  email: string
  signInTime: number
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET)
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: twentyFourHours })
}
