import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../index.js'
import { requireAuth, signToken } from '../middleware/auth.js'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
  educationLevel: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
})

router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body)
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) { res.status(409).json({ message: 'An account with this email already exists.' }); return }
    const passwordHash = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash, role: 'STUDENT', profile: { create: { preferredLanguage: 'en' } } },
    })
    const token = signToken({ userId: user.id, role: user.role, email: user.email })
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt } })
  } catch (err) { next(err) }
})

router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email: data.email }, include: { profile: true } })
    if (!user || !user.passwordHash) { res.status(401).json({ message: 'Invalid email or password.' }); return }
    const valid = await bcrypt.compare(data.password, user.passwordHash)
    if (!valid) { res.status(401).json({ message: 'Invalid email or password.' }); return }
    const token = signToken({ userId: user.id, role: user.role, email: user.email })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }, profile: user.profile })
  } catch (err) { next(err) }
})

router.post('/logout', (_req, res) => { res.json({ message: 'Logged out successfully.' }) })

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { profile: { include: { education: true, interests: true, skills: true, workPreferences: true, goals: true } } },
    })
    if (!user) { res.status(404).json({ message: 'User not found.' }); return }
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }, profile: user.profile })
  } catch (err) { next(err) }
})

export default router
