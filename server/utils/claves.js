import crypto from 'node:crypto'

export const nuevaClave = () => crypto.randomBytes(24).toString('hex')
