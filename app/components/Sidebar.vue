<template>
  <div
    :class="['h-screen bg-[#080b0f] flex flex-col justify-between pt-12 fixed transition-all duration-300',
      sidebarStore.isCollapsed ? 'w-20' : 'w-64']"
  >
    <div>
      <!-- Logo -->
      <div class="pl-6 flex items-center justify-between">
        <div class="flex items-center">
          <i class="fa-solid fa-bars-progress text-[#2f76e8] text-4xl mr-2"></i>
          <NuxtLink to="/" v-if="!sidebarStore.isCollapsed">
            <h1 class="text-white text-3xl font-bold font-sans title">
              SKILLIFY
            </h1>
          </NuxtLink>
        </div>
        <button
          @click="toggleSidebar"
          class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2f76e8] focus:ring-offset-2 focus:ring-offset-[#080b0f] min-h-[44px] min-w-[44px] flex items-center justify-center"
          :aria-expanded="!sidebarStore.isCollapsed"
          aria-label="Toggle sidebar"
        >
          <i
            :class="sidebarStore.isCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left'"
            class="text-white text-xl"
          ></i>
        </button>
      </div>

      <!-- Navigation -->
      <div
        :class="['text-white pt-8 flex flex-col font-semibold transition-all duration-300',
          sidebarStore.isCollapsed ? 'pl-2 text-sm' : 'pl-4 text-lg']"
      >
        <NuxtLink
  to="/"
  class="px-4 m-1 py-2 mr-2 rounded-md flex items-center transition-all duration-200 hover:bg-gray-700"
  :class="isActive('/') ? 'bg-[#2f76e8] shadow-md' : ''"
  :title="sidebarStore.isCollapsed ? 'Home' : ''"
>
  <i class="fa-solid fa-house text-xl" :class="sidebarStore.isCollapsed ? 'mx-auto' : 'mr-3'"></i>
  <span v-if="!sidebarStore.isCollapsed">Home</span>
</NuxtLink>

<NuxtLink
  to="/myjourney"
  class="px-4 m-1 py-2 mr-2 rounded-md flex items-center transition-all duration-200 hover:bg-gray-700"
  :class="isActive('/myjourney') ? 'bg-[#2f76e8] shadow-md' : ''"
  :title="sidebarStore.isCollapsed ? 'My Journey' : ''"
>
  <i class="fa-solid fa-route text-xl" :class="sidebarStore.isCollapsed ? 'mx-auto' : 'mr-3'"></i>
  <span v-if="!sidebarStore.isCollapsed">My Journey</span>
</NuxtLink>

<NuxtLink
  to="/courses"
  class="px-4 m-1 py-2 mr-2 rounded-md flex items-center transition-all duration-200 hover:bg-gray-700"
  :class="isActive('/courses') ? 'bg-[#2f76e8] shadow-md' : ''"
  :title="sidebarStore.isCollapsed ? 'Courses' : ''"
>
  <i class="fa-solid fa-book-open text-xl" :class="sidebarStore.isCollapsed ? 'mx-auto' : 'mr-3'"></i>
  <span v-if="!sidebarStore.isCollapsed">Courses</span>
</NuxtLink>

<NuxtLink
  to="/professors"
  class="px-4 m-1 py-2 mr-2 rounded-md flex items-center transition-all duration-200 hover:bg-gray-700"
  :class="isActive('/Professors') ? 'bg-[#2f76e8] shadow-md' : ''"
  :title="sidebarStore.isCollapsed ? 'Professors' : ''"
>
  <i class="fa-solid fa-chalkboard-user text-xl" :class="sidebarStore.isCollapsed ? 'mx-auto' : 'mr-3'"></i>
  <span v-if="!sidebarStore.isCollapsed">Professors</span>
</NuxtLink>

<NuxtLink
  to="/cart"
  class="px-4 m-1 py-2 mr-2 rounded-md flex items-center transition-all duration-200 hover:bg-gray-700"
  :class="isActive('/cart') ? 'bg-[#2f76e8] shadow-md' : ''"
  :title="sidebarStore.isCollapsed ? 'Cart' : ''"
>
  <i class="fa-solid fa-cart-shopping text-xl" :class="sidebarStore.isCollapsed ? 'mx-auto' : 'mr-3'"></i>
  <span v-if="!sidebarStore.isCollapsed">Cart</span>
</NuxtLink>

<NuxtLink
  to="/wishlist"
  class="px-4 m-1 py-2 mr-2 rounded-md flex items-center transition-all duration-200 hover:bg-gray-700"
  :class="isActive('/wishlist') ? 'bg-[#2f76e8] shadow-md' : ''"
  :title="sidebarStore.isCollapsed ? 'Wishlist' : ''"
>
  <i class="fa-solid fa-heart text-xl" :class="sidebarStore.isCollapsed ? 'mx-auto' : 'mr-3'"></i>
  <span v-if="!sidebarStore.isCollapsed">Wishlist</span>
</NuxtLink>

<NuxtLink
  to="/aboutus"
  class="px-4 m-1 py-2 mr-2 rounded-md flex items-center transition-all duration-200 hover:bg-gray-700"
  :class="isActive('/aboutus') ? 'bg-[#2f76e8] shadow-md' : ''"
  :title="sidebarStore.isCollapsed ? 'About' : ''"
>
  <i class="fa-solid fa-info-circle text-xl" :class="sidebarStore.isCollapsed ? 'mx-auto' : 'mr-3'"></i>
  <span v-if="!sidebarStore.isCollapsed">About</span>
</NuxtLink>

<NuxtLink
  to="/admin"
  class="px-4 m-1 py-2 mr-2 rounded-md flex items-center transition-all duration-200 hover:bg-gray-700"
  :class="isActive('/admin') ? 'bg-[#2f76e8] shadow-md' : ''"
  :title="sidebarStore.isCollapsed ? 'Admin' : ''"
>
  <i class="fa-solid fa-user-shield text-xl" :class="sidebarStore.isCollapsed ? 'mx-auto' : 'mr-3'"></i>
  <span v-if="!sidebarStore.isCollapsed">Admin</span>
</NuxtLink>

<NuxtLink
  to="/profile"
  class="px-4 m-1 py-2 mr-2 rounded-md flex items-center transition-all duration-200 hover:bg-gray-700"
  :class="isActive('/profile') ? 'bg-[#2f76e8] shadow-md' : ''"
  :title="sidebarStore.isCollapsed ? 'Profile' : ''"
>
  <i class="fa-solid fa-user text-xl" :class="sidebarStore.isCollapsed ? 'mx-auto' : 'mr-3'"></i>
  <span v-if="!sidebarStore.isCollapsed">Profile</span>
</NuxtLink>

      </div>
    </div>

    <hr class="text-gray-500" />
    <div class="flex p-4 gap-4">
      <div class="flex items-center gap-4 w-full" >
        <img
          :src="user?.photoURL || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80'"
          alt="User Avatar"
          class="w-12 h-12 rounded-full object-cover border-2 border-[#2f76e8]"
        />
        <div v-if="user" >
          <h1 v-if="!sidebarStore.isCollapsed" class="text-white font-bold">
            {{ user.displayName || user.name || 'Guest' }}
          </h1>
          <p v-if="!sidebarStore.isCollapsed" class="text-gray-400 text-sm truncate">{{ user.email }}</p>
        </div>
        <div v-else>
          <h1 v-if="!sidebarStore.isCollapsed" class="text-white font-bold">Guest</h1>
        </div>
      </div>
      

      <div v-if="!sidebarStore.isCollapsed">
        <i
          v-if="auth.user"
          @click="auth.logout"
          class="fa-solid fa-right-from-bracket text-2xl ml-12 text-white pt-3 cursor-pointer transition-transform duration-200 hover:scale-110"
          role="button"
          tabindex="0"
          aria-label="Logout"
          @keydown.enter="auth.logout"
        ></i>

        <NuxtLink
          v-else
          to="/login"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { useAuth } from "~/composables/useAuth";
import { useSidebarStore } from "~/stores/sidebar";
import { useCartStore } from "~/stores/cart";
import { useWishlistStore } from "~/stores/wishlist";

const auth = useAuthStore();
const { user: firebaseUser } = useAuth();
const route = useRoute();
const sidebarStore = useSidebarStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

const user = computed(() => {
  if (!auth.user && !firebaseUser.value) return null;
  return {
    ...auth.user,
    displayName: firebaseUser.value?.displayName || auth.user?.name,
    photoURL: auth.user?.photoURL || firebaseUser.value?.photoURL || "",
    email: auth.user?.email || firebaseUser.value?.email || "",
  };
});

const isActive = (path: string) => route.path === path;
const cartCount = computed(() => cartStore.cart.length);
const wishlistCount = computed(() => wishlistStore.wishlist.length);

function toggleSidebar() {
  sidebarStore.toggleSidebar();
}
</script>
