<template>
  <div class="chat-container">
    <div class="chat-box">
      <div v-for="(message, index) in chatMessages" :key="index" :class="{
        'user-message': message.role === 'user',
        'bot-message': message.role === 'assistant',
      }">
        <p v-if="message.role === 'user'" class="message-content">
          {{ message.content }}
        </p>
        <pre v-else class="message-content bot-message-pre">
          {{ message.content }}
        </pre>
      </div>
    </div>
    <div class="input-container">
      <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Message ChatGPT" class="input-box" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNuxtApp } from '#app'

const userInput = ref('')
const chatMessages = ref([])

const { $apiClient, $config } = useNuxtApp()

const sendMessage = async () => {
  if (userInput.value.trim() === '') return

  const message = { role: 'user', content: userInput.value }
  chatMessages.value.push(message)

  userInput.value = ''

  try {
    const response = await $apiClient.post('/chat/completions', {
      model: $config.public.openaiModel, // Use the configured model
      messages: chatMessages.value,
      max_tokens: 4096,
    })

    chatMessages.value.push({
      role: 'assistant',
      content: response.data.choices[0].message.content,
    })
  } catch (error) {
    chatMessages.value.push({
      role: 'assistant',
      content: 'Sorry, something went wrong. Please try again later.',
    })
  }
}
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #0d1117;
  color: #c9d1d9;
  font-family: 'Arial', sans-serif;
  overflow: hidden;
  /* Prevent scrollbar on overflow */
}
</style>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100vh;
  width: 100vw;
  background-color: #0d1117;
  box-sizing: border-box;
}

.chat-box {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #0d1117;
  box-sizing: border-box;
}

.message-content {
  margin: 10px 0;
  padding: 12px 16px;
  border-radius: 10px;
  line-height: 1.5;
  font-size: 14px;
  word-wrap: break-word;
  /* Ensure long words or URLs break */
  white-space: pre-wrap;
  /* Maintain whitespace and line breaks */
}

.user-message {
  text-align: right;
  background-color: #231f38;
  color: #ffffff;
  max-width: 100%;
  /* Adjusted from 75% to 100% to allow full width usage */
  align-self: flex-end;
}

.bot-message-pre {
  text-align: left;
  background-color: #161b22;
  color: #c9d1d9;
  max-width: 100%;
  /* Adjusted from 75% to 100% to allow full width usage */
  align-self: flex-start;
}

.input-container {
  padding: 10px 20px;
  border-top: 1px solid #21262d;
  background-color: #161b22;
}

.input-box {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background-color: #0d1117;
  color: #c9d1d9;
  font-size: 14px;
  box-sizing: border-box;
}

.input-box::placeholder {
  color: #8b949e;
}
</style>
