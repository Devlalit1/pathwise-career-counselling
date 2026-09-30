import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../index.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// Smart counsellor response generator (rule-based)
function generateCounsellorReply(content: string, careerName?: string): string {
  const msg = content.toLowerCase()
  const career = careerName ?? 'your matched career'

  if (msg.includes('hello') || msg.includes('hi ') || msg.match(/^hi$|^hey$/))
    return `Hello! I'm Pathwise AI. Based on your profile, ${career} is your top match. Ask me anything about career paths, skills to develop, salary benchmarks, or how to get started!`
  if (msg.includes('salary') || msg.includes('earn') || msg.includes('pay'))
    return `For ${career} in India, entry-level roles typically offer ₹4–8 LPA, growing to ₹12–25 LPA with 5+ years of experience. Location, company size, and specialisation significantly affect this. Would you like to explore high-paying specialisations?`
  if (msg.includes('roadmap') || msg.includes('steps') || msg.includes('plan') || msg.includes('start'))
    return `For ${career}, I recommend: 1) Build core foundations through structured coursework, 2) Work on 2–3 portfolio projects, 3) Connect with professionals on LinkedIn, 4) Target entry-level roles or internships. Your full roadmap is on the "My Plan" page!`
  if (msg.includes('skill') || msg.includes('learn') || msg.includes('course') || msg.includes('study'))
    return `Key skills for ${career}: strong technical fundamentals, problem-solving, communication, and domain-specific tools. Platforms like Coursera, NPTEL (free!), and YouTube have excellent resources. Start with one skill and practice it through projects.`
  if (msg.includes('government') || msg.includes('upsc') || msg.includes('civil') || msg.includes('ias'))
    return `Government careers offer unmatched stability and social impact. UPSC (IAS/IPS/IFS), IBPS (banking), SSC (CGL/CHSL), and state PSC exams are the main pathways. Preparation typically takes 1–3 years of dedicated study. Would you like a structured study plan?`
  if (msg.includes('college') || msg.includes('university') || msg.includes('entrance') || msg.includes('exam'))
    return `Top institutions for ${career} include IITs, NITs, IIITs (JEE), IIMs (CAT for management), AIIMS/NEET (healthcare), and NLUs (CLAT for law). Private universities like Manipal, VIT, and Amity are also strong options. Which stream are you targeting?`
  if (msg.includes('compare') || msg.includes('vs') || msg.includes('difference') || msg.includes('or'))
    return `Great question! Use the "Compare" page in the sidebar to see a detailed side-by-side comparison of up to 3 careers across salary, demand, skills, and work-life balance. This will help you make a data-driven decision.`
  if (msg.includes('abroad') || msg.includes('foreign') || msg.includes('international') || msg.includes('usa') || msg.includes('canada'))
    return `For international opportunities in ${career}, target countries with high demand: USA, Canada, Germany, Australia, and Singapore. Build a strong portfolio, get relevant certifications, and consider pursuing a Master's degree abroad. IELTS/TOEFL scores are typically required.`
  if (msg.includes('mba') || msg.includes('pgdm') || msg.includes('management degree'))
    return `An MBA from IIMs (CAT), ISB (GMAT/GRE), or XLRI significantly boosts leadership and management careers. Most programs prefer 2+ years of work experience. ROI is typically strong for management consulting, finance, and product management roles.`
  if (msg.includes('thank'))
    return `You're very welcome! Your full career dashboard, roadmap, and skill gap analysis are always available. Best of luck on your career journey — you've got this! 🎯`

  return `That's a thoughtful question about ${career}. The most important factors are: consistent skill development, building practical evidence (projects/internships), and networking with professionals in the field. Is there a specific aspect — skills, education requirements, salary potential, or day-to-day work — you'd like to explore?`
}

// GET /api/counsellor/conversations
router.get('/conversations', async (req, res, next) => {
  try {
    const conversations = await prisma.counsellingConversation.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
    })
    res.json(conversations)
  } catch (err) { next(err) }
})

// POST /api/counsellor/conversations
router.post('/conversations', async (req, res, next) => {
  try {
    const { title } = z.object({ title: z.string().max(100).optional() }).parse(req.body)
    const conversation = await prisma.counsellingConversation.create({
      data: { userId: req.userId!, title: title ?? 'Career Guidance Session' },
    })
    res.status(201).json(conversation)
  } catch (err) { next(err) }
})

// GET /api/counsellor/conversations/:id/messages
router.get('/conversations/:id/messages', async (req, res, next) => {
  try {
    const conversation = await prisma.counsellingConversation.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })
    if (!conversation) { res.status(404).json({ message: 'Conversation not found' }); return }
    const messages = await prisma.counsellingMessage.findMany({
      where: { conversationId: req.params.id },
      orderBy: { createdAt: 'asc' },
    })
    res.json(messages)
  } catch (err) { next(err) }
})

// POST /api/counsellor/conversations/:id/messages
router.post('/conversations/:id/messages', async (req, res, next) => {
  try {
    const { content } = z.object({ content: z.string().min(1).max(2000) }).parse(req.body)
    const conversation = await prisma.counsellingConversation.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })
    if (!conversation) { res.status(404).json({ message: 'Conversation not found' }); return }

    // Get user's top career for context
    const latestRec = await prisma.recommendation.findFirst({
      where: { assessment: { userId: req.userId, status: 'COMPLETED' } },
      include: { career: true },
      orderBy: { overallScore: 'desc' },
    })

    const userMessage = await prisma.counsellingMessage.create({
      data: { conversationId: req.params.id, role: 'USER', content },
    })

    const replyContent = generateCounsellorReply(content, latestRec?.career.name)
    const assistantMessage = await prisma.counsellingMessage.create({
      data: { conversationId: req.params.id, role: 'ASSISTANT', content: replyContent },
    })

    await prisma.counsellingConversation.update({
      where: { id: req.params.id },
      data: { updatedAt: new Date() },
    })

    res.json({ userMessage, assistantMessage })
  } catch (err) { next(err) }
})

export default router
