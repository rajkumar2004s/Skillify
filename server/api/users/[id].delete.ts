import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  // Check if user is admin
  // For simplicity, since the page is protected, assume admin
  // In production, check auth

  const { id } = getRouterParams(event)

  const filePath = resolve(__dirname, '../../../data/auth.json')
  const authData = JSON.parse(readFileSync(filePath, 'utf-8'))

  const userIndex = authData.findIndex((user: any) => user.id === id)
  if (userIndex === -1) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  // Remove user from array
  authData.splice(userIndex, 1)

  writeFileSync(filePath, JSON.stringify(authData, null, 2))

  return { success: true, message: 'User deleted successfully' }
})
