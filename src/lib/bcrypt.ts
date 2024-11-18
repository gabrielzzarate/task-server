import bcrypt from 'bcrypt'

export function comparePasswords(
  password: string,
  hash: string,
  callback: (err: Error | null, result: boolean) => void
) {
  console.log('comparePasswords', password, hash)
  return bcrypt.compare(password, hash, callback)
}

export function hashPassword(
  password: string,
  callback: (err: Error | null, hash: string) => void
) {
  return bcrypt.hash(password, 10, callback)
}
