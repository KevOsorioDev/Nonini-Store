import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { PrismaClient } from '@prisma/client'

const prismaDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'prisma')
fs.mkdirSync(prismaDir, { recursive: true })
process.env.DATABASE_URL = `file:${path.join(prismaDir, 'dev.db')}`

export const prisma = new PrismaClient()
