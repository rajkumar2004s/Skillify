<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p class="text-gray-600 mt-1">Real-time analytics and user management</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-sm text-gray-500">Last updated</p>
              <p class="text-sm font-medium text-gray-900">{{ new Date().toLocaleTimeString() }}</p>
            </div>
            <button
              @click="refreshData"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i class="fa-solid fa-refresh mr-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Analytics Overview -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Users -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <i class="fa-solid fa-users text-white text-sm"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Users</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsStore.analytics?.userStats?.totalUsers || 0 }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ analyticsStore.analytics?.userStats?.regularUsers || 0 }} regular, {{ analyticsStore.analytics?.userStats?.adminUsers || 0 }} admin
                </p>
              </div>
            </div>
          </div>

          <!-- Total Courses -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <i class="fa-solid fa-book text-white text-sm"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Courses</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsStore.analytics?.courseAnalytics?.totalCourses || 0 }}</p>
                <p class="text-xs text-gray-500 mt-1">Available courses</p>
              </div>
            </div>
          </div>

          <!-- Total Enrollments -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <i class="fa-solid fa-graduation-cap text-white text-sm"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Enrollments</p>
                <p class="text-2xl font-bold text-gray-900">{{ analyticsStore.analytics?.courseAnalytics?.totalEnrollments || 0 }}</p>
                <p class="text-xs text-gray-500 mt-1">Active enrollments</p>
              </div>
            </div>
          </div>

          <!-- Revenue -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <i class="fa-solid fa-dollar-sign text-white text-sm"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Revenue</p>
                <p class="text-2xl font-bold text-gray-900">${{ analyticsStore.analytics?.financialSummary?.totalRevenue || 0 }}</p>
                <p class="text-xs text-gray-500 mt-1">Total earnings</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <div class="flex items-center justify-center">
              <canvas ref="userChartRef" width="300" height="200" class="max-w-full"></canvas>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Course Analytics</h3>
            <div class="flex items-center justify-center">
              <canvas ref="courseChartRef" width="300" height="200" class="max-w-full"></canvas>
            </div>
          </div>
        </div>
      </div>



      <!-- Notifications Section -->
      <div class="mb-8">
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900">Recent Notifications</h2>
          </div>
          <div class="p-6">
            <div v-if="notifications.length === 0" class="text-center py-8">
              <i class="fa-solid fa-bell-slash text-gray-400 text-4xl mb-4"></i>
              <p class="text-gray-500">No new notifications</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="flex items-start p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400"
              >
                <div class="flex-shrink-0">
                  <i class="fa-solid fa-info-circle text-blue-400"></i>
                </div>
                <div class="ml-3 flex-1">
                  <p class="text-sm text-blue-800">{{ notification.message }}</p>
                  <p class="text-xs text-blue-600 mt-1">{{ notification.timestamp }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Management Toggle -->
    <div class="mb-8">
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900">Management</h2>
            <div class="flex items-center space-x-4">
              <button
                @click="currentView = 'users'"
                :class="currentView === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
                class="px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                User Management
              </button>
              <button
                @click="currentView = 'courses'"
                :class="currentView === 'courses' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
                class="px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Course Management
              </button>
            </div>
          </div>
        </div>
        <div class="p-6">
          <!-- User Management Section -->
          <div v-if="currentView === 'users'">
            <div class="mb-4 flex items-center justify-between">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search users by name or email..."
                class="flex-1 mr-4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @input="searchUsers"
              />
              <div class="flex space-x-2">
                <button
                  @click="exportUsers"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <i class="fa-solid fa-download mr-2"></i>
                  Export Users
                </button>
                <button
                  @click="exportAnalyticsData"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <i class="fa-solid fa-chart-line mr-2"></i>
                  Export Analytics
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in usersStore.users" :key="user.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-700">{{ user.name.charAt(0).toUpperCase() }}</span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      >
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        @click="editUser(user)"
                        class="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <i class="fa-solid fa-edit"></i> Edit
                      </button>
                      <button
                        @click="deleteUser(user.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        <i class="fa-solid fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Course Management Section -->
          <div v-if="currentView === 'courses'">
            <div class="mb-4 flex justify-end">
              <button
                @click="course.toggleNewCourse"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i class="fa-solid fa-plus mr-2"></i>
                Add Course
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="c in course.courses" :key="c.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ c.title }}</div>
                      <div class="text-sm text-gray-500 truncate max-w-xs">{{ c.description }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ c.professor }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ c.price }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span class="text-sm text-gray-900 mr-1">{{ c.rating }}</span>
                        <i class="fa-solid fa-star text-yellow-400"></i>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        @click="course.startEditCourse(c.id)"
                        class="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <i class="fa-solid fa-edit"></i> Edit
                      </button>
                      <button
                        @click="course.removeCourse(c.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        <i class="fa-solid fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Course Form Modal -->
    <CourseForm v-if="course.newCourse || course.editingCourseId" />

    <!-- User Form Modal -->
    <UserForm v-if="editingUserId" :editingUserId="editingUserId" @close="closeUserForm" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useCourseStore } from "../stores/courses";
import { useEnrolledCourseStore } from "../stores/enrolledCourses";
import { useAuthStore } from "../stores/auth";
import { useUsersStore } from "../stores/users";
import { useAnalyticsStore } from "../stores/analytics";
import { useExport } from "../composables/useExport";
import Chart from "chart.js/auto";

const course = useCourseStore();
const enrolledCourses = useEnrolledCourseStore();
const auth = useAuthStore();
const usersStore = useUsersStore();
const analyticsStore = useAnalyticsStore();

const searchQuery = ref('');
const currentView = ref('users');
const editingUserId = ref<string | null>(null);

const validUsers = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return usersStore.users.filter(user => {
    return (
      user.role === "user" &&
      user.name.trim() !== "" &&
      emailRegex.test(user.email)
    );
  });
});

const userChartRef = ref<HTMLCanvasElement>();
const courseChartRef = ref<HTMLCanvasElement>();

let userChart: Chart | null = null;
let courseChart: Chart | null = null;

const notifications = ref([
  {
    id: 1,
    message: 'New user registered: john.doe@example.com',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    message: 'Course "Advanced JavaScript" completed by 5 users',
    timestamp: '4 hours ago'
  },
  {
    id: 3,
    message: 'System maintenance scheduled for tonight',
    timestamp: '1 day ago'
  }
]);

const renderUserChart = () => {
  if (!userChartRef.value) return;
  if (userChart) userChart.destroy();

  userChart = new Chart(userChartRef.value, {
    type: "doughnut",
    data: {
      labels: ["Admins", "Regular Users"],
      datasets: [
        {
          label: "Users",
          data: [
            analyticsStore.analytics?.userStats?.adminUsers || 0,
            analyticsStore.analytics?.userStats?.regularUsers || 0,
          ],
          backgroundColor: ["#3b82f6", "#10b981"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            font: {
              size: 12
            }
          }
        }
      }
    },
  });
};

const renderCourseChart = () => {
  if (!courseChartRef.value) return;
  if (courseChart) courseChart.destroy();

  courseChart = new Chart(courseChartRef.value, {
    type: "bar",
    data: {
      labels: ["Courses", "Enrollments"],
      datasets: [
        {
          label: "Count",
          data: [
            analyticsStore.analytics?.courseAnalytics?.totalCourses || 0,
            analyticsStore.analytics?.courseAnalytics?.totalEnrollments || 0,
          ],
          backgroundColor: ["#f59e0b", "#ef4444"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        },
      },
      plugins: {
        legend: {
          display: false
        }
      }
    },
  });
};

const updateCharts = () => {
  nextTick(() => {
    renderUserChart();
    renderCourseChart();
  });
};

const searchUsers = async () => {
  if (searchQuery.value.trim()) {
    await usersStore.searchUsers(searchQuery.value);
  } else {
    await usersStore.fetchUsers();
  }
};

const editUser = (user: any) => {
  editingUserId.value = user.id;
};

const closeUserForm = () => {
  editingUserId.value = null;
};

const deleteUser = async (userId: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await usersStore.deleteUser(userId);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }
};

const refreshData = async () => {
  await usersStore.fetchUsers();
  await analyticsStore.fetchAnalytics();
  updateCharts();
};

const { exportUsers: exportUsersComposable, exportCourses, exportAnalytics } = useExport();

const exportUsers = () => {
  const users = usersStore.users;
  if (!users.length) {
    alert('No users to export');
    return;
  }
  exportUsersComposable(users);
};

const exportAnalyticsData = () => {
  const analytics = analyticsStore.analytics;
  if (!analytics) {
    alert('No analytics data to export');
    return;
  }
  exportAnalytics(analytics);
};

onMounted(async () => {
  course.fetchCourses();
  enrolledCourses.fetchEnrolledCourses();
  auth.initAuth();
  await usersStore.fetchUsers();
  await analyticsStore.fetchAnalytics();
  updateCharts();
});

watch(
  () => analyticsStore.analytics?.userStats,
  () => {
    updateCharts();
  }
);

watch(
  () => analyticsStore.analytics?.courseAnalytics,
  () => {
    updateCharts();
  }
);

onBeforeUnmount(() => {
  if (userChart) userChart.destroy();
  if (courseChart) courseChart.destroy();
});
</script>

<style scoped>
@keyframes zoomPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
.animate-zoomPulse {
  animation: zoomPulse 1.5s infinite ease-in-out;
}
</style>
