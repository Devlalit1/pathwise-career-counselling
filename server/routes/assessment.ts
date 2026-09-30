import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../index.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'
import { calculateRecommendations } from '../services/recommendation.js'

const router = Router()

// GET /api/assessment/questions — public
router.get('/questions', optionalAuth, async (_req, res, next) => {
  try {
    const questions = await prisma.assessmentQuestion.findMany({
      where: { isActive: true },
      orderBy: [{ domain: 'asc' }, { order: 'asc' }],
    })
    res.json(questions)
  } catch (err) { next(err) }
})

// GET /api/assessment/history — authenticated
router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const assessments = await prisma.assessment.findMany({
      where: { userId: req.userId, status: 'COMPLETED' },
      include: {
        recommendations: {
          include: { career: { include: { category: true } } },
          orderBy: { overallScore: 'desc' },
          take: 5,
        },
      },
      orderBy: { completedAt: 'desc' },
    })
    res.json(assessments)
  } catch (err) { next(err) }
})

// POST /api/assessment/start
router.post('/start', requireAuth, async (req, res, next) => {
  try {
    const assessment = await prisma.assessment.create({
      data: { userId: req.userId!, status: 'IN_PROGRESS', progressPercent: 0 },
    })
    res.status(201).json(assessment)
  } catch (err) { next(err) }
})

// PATCH /api/assessment/:id/answer
router.patch('/:id/answer', requireAuth, async (req, res, next) => {
  try {
    const { questionId, numericValue } = z.object({
      questionId: z.string(),
      numericValue: z.number().int().min(1).max(5),
    }).parse(req.body)

    const assessment = await prisma.assessment.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!assessment) { res.status(404).json({ message: 'Assessment not found' }); return }

    await prisma.assessmentAnswer.upsert({
      where: { assessmentId_questionId: { assessmentId: assessment.id, questionId } },
      create: { assessmentId: assessment.id, questionId, numericValue },
      update: { numericValue },
    })

    const totalQuestions = await prisma.assessmentQuestion.count({ where: { isActive: true } })
    const answered = await prisma.assessmentAnswer.count({ where: { assessmentId: assessment.id } })
    const progressPercent = Math.round((answered / totalQuestions) * 100)

    await prisma.assessment.update({ where: { id: assessment.id }, data: { progressPercent } })

    res.json({ answeredCount: answered, progressPercent })
  } catch (err) { next(err) }
})

// POST /api/assessment/:id/submit
router.post('/:id/submit', requireAuth, async (req, res, next) => {
  try {
    const assessment = await prisma.assessment.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!assessment) { res.status(404).json({ message: 'Assessment not found' }); return }

    // Build profile snapshot from answers
    const answers = await prisma.assessmentAnswer.findMany({
      where: { assessmentId: assessment.id },
      include: { question: true },
    })

    const snapshot: Record<string, Record<string, number[]>> = {}
    for (const ans of answers) {
      const domain = ans.question.domain
      const dimension = ans.question.dimension
      if (!snapshot[domain]) snapshot[domain] = {}
      if (!snapshot[domain][dimension]) snapshot[domain][dimension] = []
      snapshot[domain][dimension].push(ans.numericValue)
    }

    const profileSnapshot: Record<string, Record<string, number>> = {}
    for (const [domain, dims] of Object.entries(snapshot)) {
      profileSnapshot[domain] = {}
      for (const [dim, vals] of Object.entries(dims)) {
        profileSnapshot[domain][dim] = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20)
      }
    }

    const updated = await prisma.assessment.update({
      where: { id: assessment.id },
      data: { status: 'COMPLETED', completedAt: new Date(), progressPercent: 100, profileSnapshot },
    })

    // Calculate recommendations asynchronously
    await calculateRecommendations(assessment.id, req.userId!, prisma)

    const withRecs = await prisma.assessment.findUnique({
      where: { id: assessment.id },
      include: {
        recommendations: {
          include: { career: { include: { category: true, skills: { include: { skill: true } } } } },
          orderBy: { overallScore: 'desc' },
        },
      },
    })

    res.json(withRecs ?? updated)
  } catch (err) { next(err) }
})

export default router
