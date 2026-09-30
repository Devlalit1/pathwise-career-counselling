import { Router } from 'express'
import { prisma } from '../index.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// GET /api/roadmap/:careerId — roadmap with user progress
router.get('/:careerId', async (req, res, next) => {
  try {
    const career = await prisma.career.findUnique({
      where: { id: req.params.careerId },
      include: { roadmap: { include: { items: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } } },
    })
    if (!career) { res.status(404).json({ message: 'Career not found' }); return }

    // Get user progress
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } })
    const allItemIds = career.roadmap.flatMap((p) => p.items.map((i) => i.id))
    const progress = profile
      ? await prisma.userRoadmapProgress.findMany({ where: { profileId: profile.id, roadmapItemId: { in: allItemIds } } })
      : []
    const doneSet = new Set(progress.filter((p) => p.isCompleted).map((p) => p.roadmapItemId))

    const phases = career.roadmap.map((phase) => ({
      ...phase,
      items: phase.items.map((item) => ({ ...item, isCompleted: doneSet.has(item.id) })),
    }))

    const totalItems = allItemIds.length
    const completedItems = doneSet.size

    res.json({ phases, totalItems, completedItems, progressPercent: totalItems ? Math.round((completedItems / totalItems) * 100) : 0 })
  } catch (err) { next(err) }
})

// POST /api/roadmap/:itemId/toggle
router.post('/:itemId/toggle', async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } })
    if (!profile) { res.status(404).json({ message: 'Profile not found' }); return }

    const existing = await prisma.userRoadmapProgress.findFirst({
      where: { profileId: profile.id, roadmapItemId: req.params.itemId },
    })

    if (existing) {
      const updated = await prisma.userRoadmapProgress.update({
        where: { id: existing.id },
        data: { isCompleted: !existing.isCompleted, completedAt: !existing.isCompleted ? new Date() : null },
      })
      res.json({ isCompleted: updated.isCompleted })
    } else {
      const created = await prisma.userRoadmapProgress.create({
        data: { profileId: profile.id, roadmapItemId: req.params.itemId, isCompleted: true, completedAt: new Date() },
      })
      res.json({ isCompleted: created.isCompleted })
    }
  } catch (err) { next(err) }
})

export default router
