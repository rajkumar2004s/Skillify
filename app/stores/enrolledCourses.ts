import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { Course } from "@/types/Course";
import { useAuthStore } from "./auth";

export const useEnrolledCourseStore = defineStore("enrolledCourses", () => {
  const enrolledCourses = ref<Course[]>([]);

  // --------------------------
  // Load from localStorage (persist on refresh)
  // --------------------------
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("enrolledCourses");
    if (saved) enrolledCourses.value = JSON.parse(saved);

    watch(
      enrolledCourses,
      (val) => localStorage.setItem("enrolledCourses", JSON.stringify(val)),
      { deep: true }
    );
  }

  // --------------------------
  // Fetch from API
  // --------------------------
  const fetchEnrolledCourses = async () => {
    try {
      const data = await $fetch<Course[]>("/api/enrolledCourses");
      enrolledCourses.value = data;
    } catch (err) {
      console.error("Failed to fetch enrolled courses:", err);
    }
  };

  // --------------------------
  // Enroll a course
  // --------------------------
  const enrollCourse = async (course: Course) => {
    try {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        throw new Error("User must be logged in to enroll in a course");
      }
      if (!isEnrolled(course.id)) {
        enrolledCourses.value.push(course);
        await $fetch("/api/enrolledCourses", {
          method: "POST",
          body: course,
        });
      }
    } catch (err) {
      console.error("Failed to enroll course:", err);
      throw err;
    }
  };

  // --------------------------
  // Remove a course
  // --------------------------
  const removeCourse = async (courseId: string) => {
    try {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        throw new Error("User must be logged in to remove a course");
      }
      enrolledCourses.value = enrolledCourses.value.filter(
        (c) => c.id !== courseId
      );
      await $fetch(`/api/enrolledCourses/${courseId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to remove course:", err);
      throw err;
    }
  };

  // --------------------------
  // Helpers
  // --------------------------
  const isEnrolled = (courseId: string) =>
    enrolledCourses.value.some((c) => c.id === courseId);

  return {
    enrolledCourses,
    fetchEnrolledCourses,
    enrollCourse,
    removeCourse,
    isEnrolled,
  };
});
