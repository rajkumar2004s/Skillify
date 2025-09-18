<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <div class="hidden lg:block">
      <Sidebar v-if="showSidebar" />
    </div>

    <!-- Mobile Navbar -->
    <div class="w-full lg:hidden">
      <Navbar />
    </div>

    <!-- Main Content -->
    <main class="flex-1 transition-all bg-[#ffffff] min-h-screen" :class="mainMarginClass">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useSidebarStore } from "~/stores/sidebar";

const route = useRoute();
const sidebarStore = useSidebarStore();
const showSidebar = computed(() => route.path !== "/login");

const mainMarginClass = computed(() => {
  if (!showSidebar.value) return '';
  return sidebarStore.isCollapsed ? 'lg:ml-20' : 'lg:ml-64';
});
</script>
