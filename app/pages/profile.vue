<template>
  <div class="min-h-screen bg-gray-50 p-8 md:py-8 py-30 md:w-[78vw] w-[100vw]">
    <h1 class="text-3xl font-bold mb-6">My Profile</h1>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex items-center gap-6 mb-6">
        <img
          :src="editMode ? editedPhotoURL : (user.photoURL || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80')"
          alt="Profile Picture"
          class="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 v-if="!editMode" class="text-2xl font-semibold">{{ user.name || user.displayName }}</h2>
          <input v-else v-model="editedName" class="text-2xl font-semibold border rounded px-2 py-1" placeholder="Name" />
          <p class="text-gray-600">{{ user.email }}</p>
          <p class="text-sm text-gray-500">Role: {{ user.role || 'User' }}</p>
        </div>
      </div>

      <div class="mb-4">
        <button v-if="!editMode" @click="startEdit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Edit Profile
        </button>
        <div v-else class="space-x-2">
          <button @click="saveProfile" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Save
          </button>
          <button @click="cancelEdit" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </div>

      <div v-if="editMode" class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Edit Profile Image</h3>
        <input v-model="editedPhotoURL" class="border rounded px-2 py-1 w-full" placeholder="Profile Image URL" />
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold mb-4">Account Information</h3>
          <div class="space-y-2">
            <p><strong>Name:</strong> {{ user.name || user.displayName }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Role:</strong> {{ user.role || 'User' }}</p>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">Statistics</h3>
          <div class="space-y-2">
            <p><strong>Enrolled Courses:</strong> {{ enrolledCourses.length }}</p>
            <p><strong>Completed Courses:</strong> {{ completedCourses }}</p>
            <p><strong>Total Spent:</strong> ${{ totalSpent }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
definePageMeta({
  requiresAuth: true,
});

import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { useAuth } from "~/composables/useAuth";
import { useEnrolledCourseStore } from "~/stores/enrolledCourses";

const auth = useAuthStore();
const { user: firebaseUser } = useAuth();
const enrolledStore = useEnrolledCourseStore();
const router = useRouter();

const editMode = ref(false);
const editedName = ref('');
const editedPhotoURL = ref('');

onMounted(() => {
  if (!auth.isAuthenticated) {
    router.push("/login");
  }
});

const user = computed(() => ({
  ...auth.user,
  displayName: firebaseUser.value?.displayName,
  photoURL: auth.user?.photoURL || firebaseUser.value?.photoURL,
}));

const enrolledCourses = computed(() => enrolledStore.enrolledCourses);

const completedCourses = computed(() =>
  enrolledCourses.value.filter((course: any) => course.enrolled).length
);

const totalSpent = computed(() =>
  enrolledCourses.value.reduce((sum: number, course: any) => sum + (course.price || 0), 0)
);

const startEdit = () => {
  editMode.value = true;
  editedName.value = user.value.name || user.value.displayName || '';
  editedPhotoURL.value = user.value.photoURL || '';
};

const saveProfile = async () => {
  if (!auth.user) return;
  const updatedUser = {
    ...auth.user,
    id: auth.user.id,
    name: editedName.value,
    email: auth.user.email,
    role: auth.user.role,
    photoURL: editedPhotoURL.value,
  };
  try {
    const response = await $fetch(`/api/users/${auth.user.id}`, {
      method: 'PUT',
      body: updatedUser,
    });
    auth.setUser(response);
    editMode.value = false;
  } catch (error) {
    console.error('Failed to save profile:', error);
    // Optionally show error notification to user
  }
};

const cancelEdit = () => {
  editMode.value = false;
  editedName.value = '';
  editedPhotoURL.value = '';
};
</script>
