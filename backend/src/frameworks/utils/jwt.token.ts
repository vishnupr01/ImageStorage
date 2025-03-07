import * as jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET || "secret_key"

export function createJWT(payload: object, expiresIn: string | number): string {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" })
  return token
}
export function verifyJWT<T>(token: string): T | null{
  try {
    const decoded=jwt.verify(token,JWT_SECRET)
    return decoded as T

  } catch (error) {
    console.log(error);
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('TokenExpired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('InvalidToken');
    } else {
      throw new Error('JwtVerificationError');
    }

  }
}