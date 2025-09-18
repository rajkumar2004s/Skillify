<template>
  <div class="flex min-h-screen bg-[#1f1f1f] text-[#e3e3e3]">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header
        class="flex justify-between items-center px-6 py-4 border-b border-[#333]"
      >
        <h1 class="text-xl font-bold">Ai Assistant</h1>
        <div
          class="w-8 h-8 bg-gradient-to-br from-[#4285f4] to-[#9c27b0] rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer"
        >
          R
        </div>
      </header>

      <!-- Chat Area -->
      <main
        class="flex-1 flex flex-col items-center justify-center px-6 relative"
      >
        <!-- Welcome -->
        <div v-if="!hasMessages" class="text-5xl font-light text-center mb-12">
          <div v-if="auth.user" class="text-white font-bold pr-2 pt-3">
            <h1 class="text-white font-bold">
              Hello, {{ (user.displayName || user.name)?.split(" ")[0] }}
            </h1>
          </div>
        </div>

        <!-- Messages -->
        <div
          v-else
          ref="messagesContainer"
          class="w-full max-w-3xl flex-1 overflow-y-auto py-6 space-y-6"
        >
          <div
            v-for="msg in currentMessages"
            :key="msg.id"
            class="flex gap-3"
            :class="{ 'justify-end': msg.sender === 'user' }"
          >
            <!-- Assistant Avatar -->
            <div
              v-if="msg.sender === 'assistant'"
              class="w-8 h-8 bg-gradient-to-br from-[#4285f4] to-[#9c27b0] rounded-full flex items-center justify-center flex-shrink-0"
            >
              <i class="fas fa-star text-white text-sm"></i>
            </div>

            <!-- Message Bubble -->
            <div
              class="max-w-[80%] px-4 py-3 rounded-2xl leading-relaxed"
              :class="
                msg.sender === 'user'
                  ? 'bg-[#4285f4] text-white rounded-br-sm'
                  : 'bg-[#2d2d2d] text-[#e3e3e3] rounded-bl-sm'
              "
            >
              {{ msg.text }}
            </div>
          </div>

          <!-- Loader Bubble -->
          <div v-if="isLoading" class="flex gap-3">
            <div
              class="w-8 h-8 bg-gradient-to-br from-[#4285f4] to-[#9c27b0] rounded-full flex items-center justify-center flex-shrink-0"
            >
              <i class="fas fa-star text-white text-sm"></i>
            </div>
            <div
              class="px-4 py-3 rounded-2xl bg-[#2d2d2d] text-[#e3e3e3] rounded-bl-sm flex items-center gap-2"
            >
              <span class="loader-dot"></span>
              <span class="loader-dot"></span>
              <span class="loader-dot"></span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="w-full max-w-3xl absolute bottom-6 mt-26">
          <div
            class="bg-[#2d2d2d] border border-[#333] rounded-3xl p-4 flex items-center gap-4 focus-within:border-[#4285f4] transition-colors"
          >
            <!-- Plus Button -->
            <button
              class="text-[#9aa0a6] hover:bg-[#333] p-2 rounded-full transition-colors"
            >
              <i class="fas fa-plus"></i>
            </button>

            <!-- Textarea -->
            <textarea
              ref="textareaRef"
              v-model="inputText"
              @keydown="handleKeyDown"
              @input="adjustHeight"
              placeholder="Ask Gemini"
              rows="1"
              class="flex-1 bg-transparent border-none outline-none text-[#e3e3e3] placeholder-[#9aa0a6] resize-none max-h-32"
            ></textarea>

            <!-- Tools + Mic -->
            <div class="flex items-center gap-3">
              <div
                class="flex items-center gap-2 text-[#9aa0a6] cursor-pointer hover:bg-[#333] px-3 py-2 rounded-2xl transition-colors"
              >
                <i class="fas fa-wrench"></i>
                <span class="text-sm">Tools</span>
              </div>
              <button
                class="text-[#9aa0a6] hover:bg-[#333] p-2 rounded-full transition-colors"
              >
                <i class="fas fa-microphone"></i>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
definePageMeta({
  requiresAuth: true,
});

import { ref, computed, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { useAuth } from "~/composables/useAuth";

const auth = useAuthStore();
const { user: firebaseUser } = useAuth();
const route = useRoute();

const user = computed(() => ({
  ...auth.user,
  displayName: firebaseUser.value?.displayName,
  photoURL: firebaseUser.value?.photoURL,
}));

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastActivity: Date;
}

// -------------------------
// State
// -------------------------
const conversations = ref<Conversation[]>([]);
const currentConversationId = ref<string | null>(null);
const inputText = ref("");
const textareaRef = ref<HTMLTextAreaElement>();
const messagesContainer = ref<HTMLElement>();
const isLoading = ref(false);

// -------------------------
// Computed
// -------------------------
const currentMessages = computed(() => {
  return (
    conversations.value.find((c) => c.id === currentConversationId.value)
      ?.messages || []
  );
});

const hasMessages = computed(() => currentMessages.value.length > 0);

// -------------------------
// Methods
// -------------------------
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

const sendMessage = async () => {
  const text = inputText.value.trim();
  if (!text) return;

  // Create new conversation if none exists
  if (!currentConversationId.value) {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: text.slice(0, 30) + (text.length > 30 ? "..." : ""),
      messages: [],
      lastActivity: new Date(),
    };
    conversations.value.unshift(newConversation);
    currentConversationId.value = newConversation.id;
  }

  const conversation = conversations.value.find(
    (c) => c.id === currentConversationId.value
  );
  if (!conversation) return;

  // Add user message
  conversation.messages.push({
    id: Date.now().toString(),
    text,
    sender: "user",
    timestamp: new Date(),
  });
  conversation.lastActivity = new Date();

  inputText.value = "";
  resetHeight();
  await scrollToBottom();

  // -------------------------
  // Gemini API Call
  // -------------------------
  try {
    isLoading.value = true;
    const response = await $fetch<{ reply: string }>("/api/chat", {
      method: "POST",
      body: { message: text },
    });

    conversation.messages.push({
      id: (Date.now() + 1).toString(),
      text: response.reply,
      sender: "assistant",
      timestamp: new Date(),
    });
    conversation.lastActivity = new Date();
  } catch (error) {
    console.error("Gemini fetch error:", error);
    conversation.messages.push({
      id: (Date.now() + 1).toString(),
      text: "⚠️ Sorry, something went wrong while contacting Gemini.",
      sender: "assistant",
      timestamp: new Date(),
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const adjustHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = textareaRef.value.scrollHeight + "px";
  }
};

const resetHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
  }
};
</script>

<style scoped>
.loader-dot {
  width: 8px;
  height: 8px;
  background-color: #9aa0a6;
  border-radius: 50%;
  display: inline-block;
  animation: bounce 1.4s infinite;
}
.loader-dot:nth-child(2) {
  animation-delay: 0.2s;
}
.loader-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
