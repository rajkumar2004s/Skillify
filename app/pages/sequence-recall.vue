<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
          Sequence Recall Test
        </h1>

        <!-- Instructions -->
        <div v-if="!gameStarted && !gameFinished" class="text-center mb-8">
          <h2 class="text-xl font-semibold mb-4">How to Play</h2>
          <p class="text-gray-600 mb-4">
            Watch the sequence of colored squares that will light up. Then repeat the sequence by clicking the squares in the same order.
          </p>
          <button
            @click="startGame"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Start Test
          </button>
        </div>

        <!-- Game Board -->
        <div v-if="gameStarted || gameFinished" class="mb-8">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
            <div
              v-for="(color, index) in colors"
              :key="index"
              :class="[
                'aspect-square rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105',
                getSquareClass(index)
              ]"
              @click="handleSquareClick(index)"
            ></div>
          </div>
        </div>

        <!-- Game Status -->
        <div v-if="gameStarted && !showingSequence" class="text-center mb-4">
          <p class="text-lg font-semibold text-gray-700">
            {{ isPlayerTurn ? 'Your turn! Repeat the sequence.' : 'Watch the sequence...' }}
          </p>
          <p class="text-sm text-gray-500">Level: {{ currentLevel }}</p>
        </div>

        <!-- Game Over / Success -->
        <div v-if="gameFinished" class="text-center">
          <h2 class="text-2xl font-bold mb-4" :class="gameWon ? 'text-green-600' : 'text-red-600'">
            {{ gameWon ? 'Congratulations!' : 'Game Over' }}
          </h2>
          <p class="text-lg mb-4">
            {{ gameWon ? `You completed level ${currentLevel}!` : `You reached level ${currentLevel}.` }}
          </p>
          <div class="space-x-4">
            <button
              @click="startGame"
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Play Again
            </button>
            <button
              @click="resetGame"
              class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Back to Instructions
            </button>
          </div>
        </div>

        <!-- Score Display -->
        <div v-if="gameStarted || gameFinished" class="mt-8 text-center">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-2">Your Progress</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium">Current Level:</span> {{ currentLevel }}
              </div>
              <div>
                <span class="font-medium">Best Score:</span> {{ bestScore }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const colors = ['red', 'blue', 'green', 'yellow']
const gameStarted = ref(false)
const gameFinished = ref(false)
const gameWon = ref(false)
const showingSequence = ref(false)
const isPlayerTurn = ref(false)
const currentLevel = ref(1)
const bestScore = ref(0)
const sequence = ref<number[]>([])
const playerSequence = ref<number[]>([])
const activeSquare = ref<number | null>(null)

const startGame = () => {
  gameStarted.value = true
  gameFinished.value = false
  gameWon.value = false
  currentLevel.value = 1
  sequence.value = []
  playerSequence.value = []
  generateSequence()
  showSequence()
}

const resetGame = () => {
  gameStarted.value = false
  gameFinished.value = false
  gameWon.value = false
  currentLevel.value = 1
  sequence.value = []
  playerSequence.value = []
  activeSquare.value = null
}

const generateSequence = () => {
  const randomIndex = Math.floor(Math.random() * colors.length)
  sequence.value.push(randomIndex)
}

const showSequence = async () => {
  showingSequence.value = true
  isPlayerTurn.value = false

  for (let i = 0; i < sequence.value.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 600))
    activeSquare.value = sequence.value[i]!
    await new Promise(resolve => setTimeout(resolve, 600))
    activeSquare.value = null
  }

  showingSequence.value = false
  isPlayerTurn.value = true
  playerSequence.value = []
}

const handleSquareClick = (index: number) => {
  if (!isPlayerTurn.value || showingSequence.value) return

  playerSequence.value.push(index)
  activeSquare.value = index

  setTimeout(() => {
    activeSquare.value = null
  }, 200)

  // Check if the clicked square matches the sequence
  const currentIndex = playerSequence.value.length - 1
  if (playerSequence.value[currentIndex] !== sequence.value[currentIndex]) {
    // Wrong sequence
    gameFinished.value = true
    gameWon.value = false
    if (currentLevel.value > bestScore.value) {
      bestScore.value = currentLevel.value
    }
    return
  }

  // Check if sequence is complete
  if (playerSequence.value.length === sequence.value.length) {
    // Level completed
    currentLevel.value++
    if (currentLevel.value > bestScore.value) {
      bestScore.value = currentLevel.value
    }
    setTimeout(() => {
      generateSequence()
      showSequence()
    }, 1000)
  }
}

const getSquareClass = (index: number) => {
  const baseClasses = 'border-4 border-gray-300'
  if (activeSquare.value === index) {
    return `${baseClasses} bg-${colors[index]}-500 shadow-lg transform scale-110`
  }
  return `${baseClasses} bg-${colors[index]}-400 hover:bg-${colors[index]}-500`
}

onMounted(() => {
  // Load best score from localStorage
  const savedBestScore = localStorage.getItem('sequenceRecallBestScore')
  if (savedBestScore) {
    bestScore.value = parseInt(savedBestScore)
  }
})

// Save best score when it changes
watch(bestScore, (newScore) => {
  localStorage.setItem('sequenceRecallBestScore', newScore.toString())
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
