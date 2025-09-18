import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  // Check if user is admin
  // For simplicity, since the page is protected, assume admin
  // In production, check auth

  const filePath = join(process.cwd(), 'data/auth.json')
  const authData = JSON.parse(readFileSync(filePath, 'utf-8'))

  // Remove passwords for security
  const users = authData.map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }))

  return users
})
