import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

if (process.env.NODE_ENV !== 'production') {
  process.exit(0)
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env
  })
  return result.status === 0
}

const frontOk = run('npx', ['vite', 'build'])
if (!frontOk) {
  console.error('vite build falló; el API igual puede arrancar')
}

const prismaOk = run('npx', ['prisma', 'generate', '--schema=server/prisma/schema.prisma'])
if (!prismaOk) {
  console.error('prisma generate falló')
}

const migrateOk = run('npx', ['prisma', 'migrate', 'deploy', '--schema=server/prisma/schema.prisma'])
if (!migrateOk) {
  console.error('prisma migrate falló en postinstall')
}
