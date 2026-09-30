import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

// Routes
import authRouter from './routes/auth.js'
import careersRouter from './routes/careers.js'
import profileRouter from './routes/profile.js'
import assessmentRouter from './routes/assessment.js'
import recommendationsRouter from './routes/recommendations.js'
import roadmapRouter from './routes/roadmap.js'
import counsellorRouter from './routes/counsellor.js'
import adminRouter from './routes/admin.js'

// Middleware
import { errorHandler } from './middleware/errorHandler.js'

// ─── Prisma ─────────────────────────────────────────────────────────────────

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

// ─── App ─────────────────────────────────────────────────────────────────────

const app = express()

// CORS — allow GitHub Pages origin and local dev
const allowedOrigins = [
  process.env.FRONTEND_URL ?? 'https://devlalit1.github.io',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
]

app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
      cb(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── Health ───────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: process.env.npm_package_version ?? '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'development',
  })
})

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use('/api/auth', authRouter)
app.use('/api/careers', careersRouter)
app.use('/api/profile', profileRouter)
app.use('/api/assessment', assessmentRouter)
app.use('/api/recommendations', recommendationsRouter)
app.use('/api/roadmap', roadmapRouter)
app.use('/api/counsellor', counsellorRouter)
app.use('/api/admin', adminRouter)

// 404 for unmatched API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ message: 'API route not found' })
})

// ─── Error handler ────────────────────────────────────────────────────────────

app.use(errorHandler)

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = Number(process.env.PORT ?? 3001)

async function start() {
  try {
    await prisma.$connect()
    console.log('✓ Database connected')

    app.listen(PORT, () => {
      console.log(`✓ Pathwise API running on http://localhost:${PORT}`)
      console.log(`  Environment: ${process.env.NODE_ENV ?? 'development'}`)
    })
  } catch (err) {
    console.error('✕ Failed to start server:', err)
    await prisma.$disconnect()
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received — closing gracefully…')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

start()
