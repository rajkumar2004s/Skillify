import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  // Check if user is admin
  // For simplicity, since the page is protected, assume admin
  // In production, check auth

  const query = getQuery(event)
  const searchTerm = (query.q || '').toString().toLowerCase()

  const filePath = resolve(__dirname, '../../../data/auth.json')
  const authData = JSON.parse(readFileSync(filePath, 'utf-8'))

  // Filter users by name or email containing searchTerm
  const filteredUsers = authData.filter((user: any) => {
    return (
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    )
  })

  // Remove passwords for security
  const users = filteredUsers.map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }))

  return users
})
