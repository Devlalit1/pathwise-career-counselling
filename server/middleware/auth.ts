import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      userRole?: string
    }
  }
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET environment variable is not set')
  return secret
}

function extractToken(req: Request): string | null {
  const auth = req.headers.authorization
  if (auth?.startsWith('Bearer ')) return auth.slice(7)
  return null
}

interface JwtPayload {
  userId: string
  role: string
  email: string
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req)
  if (!token) {
    res.status(401).json({ message: 'Authentication required. Please sign in.' })
    return
  }
  try {
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload
    req.userId = payload.userId
    req.userRole = payload.role
    next()
  } catch {
    res.status(401).json({ message: 'Token is invalid or has expired. Please sign in again.' })
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req)
  if (token) {
    try {
      const payload = jwt.verify(token, getJwtSecret()) as JwtPayload
      req.userId = payload.userId
      req.userRole = payload.role
    } catch { /* ignore */ }
  }
  next()
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.userRole !== 'ADMIN') {
      res.status(403).json({ message: 'Admin access required.' })
      return
    }
    next()
  })
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '30d' })
}
