import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  // Check if user is admin
  // For simplicity, since the page is protected, assume admin
  // In production, check auth

  const basePath = process.cwd()

  const authFilePath = resolve(basePath, 'data/auth.json')
  const coursesFilePath = resolve(basePath, 'data/courses.json')
  const enrolledCoursesFilePath = resolve(basePath, 'data/enrolledCourses.json')

  const authData = JSON.parse(readFileSync(authFilePath, 'utf-8'))
  const coursesData = JSON.parse(readFileSync(coursesFilePath, 'utf-8'))
  const enrolledCoursesData = JSON.parse(readFileSync(enrolledCoursesFilePath, 'utf-8'))

  // User Statistics
  const totalUsers = authData.length
  const adminUsers = authData.filter((user: any) => user.role === 'admin').length
  const regularUsers = totalUsers - adminUsers

  // Calculate new signups (users created in last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const newSignups = authData.filter((user: any) => {
    // Assuming users have a createdAt field, if not, we'll use a different approach
    return user.createdAt ? new Date(user.createdAt) > thirtyDaysAgo : false
  }).length

  // Course Analytics
  const totalCourses = coursesData.length
  const totalEnrollments = enrolledCoursesData.length
  const averageRating = coursesData.reduce((sum: number, course: any) => sum + course.rating, 0) / totalCourses

  // Financial Summaries
  const totalRevenue = enrolledCoursesData.reduce((sum: number, enrollment: any) => {
    const course = coursesData.find((c: any) => c.id === enrollment.courseId)
    return sum + (course ? course.price : 0)
  }, 0)

  // Monthly revenue (simplified - assuming enrollments have timestamps)
  const monthlyRevenue = enrolledCoursesData.filter((enrollment: any) => {
    const enrollmentDate = new Date(enrollment.enrolledAt || Date.now())
    const now = new Date()
    return enrollmentDate.getMonth() === now.getMonth() && enrollmentDate.getFullYear() === now.getFullYear()
  }).reduce((sum: number, enrollment: any) => {
    const course = coursesData.find((c: any) => c.id === enrollment.courseId)
    return sum + (course ? course.price : 0)
  }, 0)

  return {
    userStats: {
      totalUsers,
      adminUsers,
      regularUsers,
      newSignups
    },
    courseAnalytics: {
      totalCourses,
      totalEnrollments,
      averageRating: Math.round(averageRating * 10) / 10
    },
    financialSummary: {
      totalRevenue,
      monthlyRevenue
    }
  }
})
