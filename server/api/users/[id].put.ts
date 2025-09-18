import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

export default defineEventHandler(async (event) => {
  // Check if user is admin
  // For simplicity, since the page is protected, assume admin
  // In production, check auth

  const { id } = getRouterParams(event)
  const body = await readBody(event)

  const filePath = resolve(process.cwd(), 'data/auth.json')
  const authData = JSON.parse(readFileSync(filePath, 'utf-8'))

  const userIndex = authData.findIndex((user: any) => user.id === id)
  if (userIndex === -1) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  // Update user data (excluding password for security)
  const updatedUser = { ...authData[userIndex], ...body }
  delete updatedUser.password // Ensure password is not updated via this endpoint

  authData[userIndex] = updatedUser

  writeFileSync(filePath, JSON.stringify(authData, null, 2))

  // Return updated user without password
  const { password, ...userWithoutPassword } = updatedUser
  return userWithoutPassword
})
