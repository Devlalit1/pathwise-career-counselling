import { Router } from 'express'
import { prisma } from '../index.js'

const router = Router()

// GET /api/careers — list all with optional filters
router.get('/', async (req, res, next) => {
  try {
    const { category, search, difficulty, demand } = req.query as Record<string, string>
    const where: Record<string, unknown> = {}
    if (category) where.category = { name: { contains: category, mode: 'insensitive' } }
    if (difficulty) where.difficulty = difficulty
    if (demand) where.demandLevel = demand
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { overview: { contains: search, mode: 'insensitive' } },
      ]
    }
    const careers = await prisma.career.findMany({
      where: { isActive: true, ...where },
      include: {
        category: true,
        skills: { include: { skill: true }, take: 6 },
      },
      orderBy: { name: 'asc' },
    })
    res.json(careers)
  } catch (err) { next(err) }
})

// GET /api/careers/:slug — single career with full details
router.get('/:slug', async (req, res, next) => {
  try {
    const career = await prisma.career.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        skills: { include: { skill: true } },
        roadmap: { include: { items: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } },
        fitProfile: true,
        interests: { include: { interest: true } },
      },
    })
    if (!career) { res.status(404).json({ message: 'Career not found' }); return }
    res.json(career)
  } catch (err) { next(err) }
})

export default router
