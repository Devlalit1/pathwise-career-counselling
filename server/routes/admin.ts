import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../index.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()
router.use(requireAdmin)

// GET /api/admin/stats
router.get('/stats', async (_req, res, next) => {
  try {
    const [totalUsers, totalAssessments, totalCareers, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.assessment.count({ where: { status: 'COMPLETED' } }),
      prisma.career.count({ where: { isActive: true } }),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
    ])
    res.json({ totalUsers, totalAssessments, totalCareers, recentUsers })
  } catch (err) { next(err) }
})

// GET /api/admin/users
router.get('/users', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { profile: { include: { education: true } } },
      select: { id: true, name: true, email: true, role: true, createdAt: true, profile: true },
    })
    res.json(users)
  } catch (err) { next(err) }
})

// GET /api/admin/users/:id
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        profile: { include: { education: true, interests: true, skills: true, goals: true } },
        assessments: { include: { recommendations: { include: { career: true } } }, orderBy: { createdAt: 'desc' }, take: 5 },
      },
    })
    if (!user) { res.status(404).json({ message: 'User not found' }); return }
    res.json(user)
  } catch (err) { next(err) }
})

// GET /api/admin/careers
router.get('/careers', async (_req, res, next) => {
  try {
    const careers = await prisma.career.findMany({
      include: { category: true, _count: { select: { recommendations: true } } },
      orderBy: { name: 'asc' },
    })
    res.json(careers)
  } catch (err) { next(err) }
})

// POST /api/admin/careers
router.post('/careers', async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(2),
      slug: z.string().min(2),
      categoryId: z.string(),
      overview: z.string(),
      difficulty: z.string(),
      demandLevel: z.string(),
      salaryMinSample: z.number().optional(),
      salaryMaxSample: z.number().optional(),
    })
    const data = schema.parse(req.body)
    const career = await prisma.career.create({ data: { ...data, isActive: true } })
    res.status(201).json(career)
  } catch (err) { next(err) }
})

// PATCH /api/admin/careers/:id
router.patch('/careers/:id', async (req, res, next) => {
  try {
    const career = await prisma.career.update({ where: { id: req.params.id }, data: req.body })
    res.json(career)
  } catch (err) { next(err) }
})

// DELETE /api/admin/careers/:id — soft delete
router.delete('/careers/:id', async (req, res, next) => {
  try {
    await prisma.career.update({ where: { id: req.params.id }, data: { isActive: false } })
    res.json({ message: 'Career deactivated' })
  } catch (err) { next(err) }
})

export default router
