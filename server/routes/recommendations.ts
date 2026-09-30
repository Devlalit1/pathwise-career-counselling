import { Router } from 'express'
import { prisma } from '../index.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// GET /api/recommendations — latest for this user
router.get('/', async (req, res, next) => {
  try {
    const latestAssessment = await prisma.assessment.findFirst({
      where: { userId: req.userId, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
    })
    if (!latestAssessment) { res.json([]); return }

    const recs = await prisma.recommendation.findMany({
      where: { assessmentId: latestAssessment.id },
      include: { career: { include: { category: true, skills: { include: { skill: true } } } } },
      orderBy: { overallScore: 'desc' },
    })
    res.json(recs)
  } catch (err) { next(err) }
})

// GET /api/recommendations/:assessmentId — by specific assessment
router.get('/:assessmentId', async (req, res, next) => {
  try {
    const assessment = await prisma.assessment.findFirst({ where: { id: req.params.assessmentId, userId: req.userId } })
    if (!assessment) { res.status(404).json({ message: 'Assessment not found' }); return }

    const recs = await prisma.recommendation.findMany({
      where: { assessmentId: req.params.assessmentId },
      include: { career: { include: { category: true, skills: { include: { skill: true } } } } },
      orderBy: { overallScore: 'desc' },
    })
    res.json(recs)
  } catch (err) { next(err) }
})

export default router
