<template>
  <div class="p-8 md:py-8 py-32">
    <div class="text-center mb-12">
      <h1
        class="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
      >
        Meet Our Professors
      </h1>
      <p class="text-gray-500 mt-2">
        The mentors who will guide you to mastery 🚀
      </p>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:w-[78vw] w-[100vw]"
    >
      <div
        v-for="professor in professors"
        :key="professor.name"
        class="relative group rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-500 p-6 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-200 hover:to-purple-300"
      >
        <div class="relative flex flex-col items-center">
          <div
            class="h-24 w-24 rounded-full overflow-hidden ring-4 ring-offset-2 ring-white shadow-md mb-4 transform group-hover:scale-110 transition duration-500"
          >
            <img
              :src="professor.avatar"
              alt="professor"
              class="h-full w-full object-cover"
            />
          </div>

          <h2 class="text-xl font-bold text-gray-800 group-hover:text-blue-700">
            {{ professor.name }}
          </h2>
          <p class="text-gray-600 text-sm">
            Teaches {{ professor.courses.length }} course(s)
          </p>
        </div>

        <div class="mt-4 space-y-2">
          <div
            v-for="course in professor.courses"
            :key="course.id"
            class="flex items-center justify-between bg-white/60 backdrop-blur-sm p-3 rounded-lg hover:bg-white/80 transition"
          >
            <span class="text-sm font-medium text-gray-700 truncate">
              {{ course.title }}
            </span>
            <span
              class="text-xs font-semibold text-blue-700 px-2 py-1 rounded-full bg-blue-100"
            >
              ⭐ {{ course.rating }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCourseStore } from "../stores/courses";
import { computed } from "vue";

const courseStore = useCourseStore();

const professors = computed(() => {
  const profMap: Record<string, any> = {};

  courseStore.courses.forEach((course) => {
    if (!profMap[course.professor]) {
      profMap[course.professor] = {
        name: course.professor,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${course.professor}`,
        courses: [],
      };
    }
    profMap[course.professor].courses.push(course);
  });

  return Object.values(profMap);
});
</script>
