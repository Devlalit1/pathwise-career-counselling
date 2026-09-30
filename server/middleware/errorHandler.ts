import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

interface PrismaError { code?: string; meta?: { target?: string[] } }

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(422).json({ message: 'Validation failed', errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })) })
    return
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({ message: 'Invalid or expired token' })
    return
  }
  const pe = err as PrismaError
  if (pe.code === 'P2002') { res.status(409).json({ message: `${pe.meta?.target?.[0] ?? 'field'} is already taken` }); return }
  if (pe.code === 'P2025') { res.status(404).json({ message: 'Resource not found' }); return }
  if (process.env.NODE_ENV !== 'production') console.error('[Error]', err)
  const status = (err as { status?: number }).status ?? 500
  res.status(status).json({ message: status < 500 ? (err as Error).message : 'Internal server error' })
}
