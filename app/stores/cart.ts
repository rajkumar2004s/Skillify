import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { Course } from "@/types/Course";

export const useCartStore = defineStore("cart", () => {
  const cart = ref<Course[]>([]);

  // ✅ Load cart from localStorage (immediately on store creation)
  const loadCart = () => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        cart.value = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load cart:", e);
      cart.value = [];
    }
  };
  loadCart();

  // ✅ Persist cart to localStorage automatically
  watch(
    cart,
    (val) => {
      localStorage.setItem("cart", JSON.stringify(val));
    },
    { deep: true }
  );

  // ✅ Add to cart
  const addToCart = (course: Course) => {
    if (!isInCart(course.id)) {
      cart.value.push(course);
    }
  };

  // ✅ Remove from cart
  const removeFromCart = (id: string) => {
    cart.value = cart.value.filter((c) => c.id !== id);
  };

  // ✅ Check if in cart
  const isInCart = (id: string) => {
    return cart.value.some((c) => c.id === id);
  };

  const clearCart = () => {
    cart.value = [];
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    isInCart,
    clearCart,
  };
});
