import { useAuthStore } from "@/stores/auth";

export default defineNuxtPlugin(() => {
  const auth = useAuthStore();
  auth.initAuth(); // ✅ restore user from localStorage on app load
});
