import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../index.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// GET /api/profile
router.get('/', async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId },
      include: { education: true, interests: true, skills: true, workPreferences: true, goals: true },
    })
    if (!profile) { res.status(404).json({ message: 'Profile not found' }); return }
    res.json(profile)
  } catch (err) { next(err) }
})

// PATCH /api/profile
router.patch('/', async (req, res, next) => {
  try {
    const schema = z.object({
      bio: z.string().max(500).optional(),
      age: z.number().int().min(10).max(100).optional(),
      location: z.string().max(100).optional(),
      preferredLanguage: z.string().max(10).optional(),
      educationLevel: z.string().optional(),
      stream: z.string().optional(),
      degree: z.string().optional(),
      branch: z.string().optional(),
      institutionName: z.string().optional(),
      percentage: z.number().optional(),
      graduationYear: z.number().int().optional(),
    })
    const data = schema.parse(req.body)

    const { educationLevel, stream, degree, branch, institutionName, percentage, graduationYear, ...profileData } = data

    const profile = await prisma.profile.upsert({
      where: { userId: req.userId },
      create: { userId: req.userId!, preferredLanguage: 'en', ...profileData },
      update: profileData,
    })

    if (educationLevel) {
      await prisma.education.upsert({
        where: { profileId: profile.id },
        create: { profileId: profile.id, educationLevel, stream, degree, branch, institutionName, percentage, graduationYear },
        update: { educationLevel, stream, degree, branch, institutionName, percentage, graduationYear },
      })
    }

    const updated = await prisma.profile.findUnique({
      where: { userId: req.userId },
      include: { education: true, interests: true, skills: true, workPreferences: true, goals: true },
    })
    res.json(updated)
  } catch (err) { next(err) }
})

// PATCH /api/profile/primary-career
router.patch('/primary-career', async (req, res, next) => {
  try {
    const { careerId } = z.object({ careerId: z.string() }).parse(req.body)
    // upsert the saved career with isPrimary
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } })
    if (!profile) { res.status(404).json({ message: 'Profile not found' }); return }
    await prisma.savedCareer.upsert({
      where: { profileId_careerId: { profileId: profile.id, careerId } },
      create: { profileId: profile.id, careerId, isPrimary: true },
      update: { isPrimary: true },
    })
    res.json({ message: 'Primary career set' })
  } catch (err) { next(err) }
})

export default router
