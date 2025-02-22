<script setup>
import api from '@/utils/api'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const account = ref('')
const password = ref('')
const token = ref('')
async function login() {
  try {
    const res = await api.post('/login', {
      account: account.value,
      password: password.value,
  })
    token.value = res
    localStorage.setItem('token', token.value)
    ElMessage.success('登入成功')
    router.push('/employee')
  } catch (error) {
    console.error(error)
    ElMessage.error('登入失敗')
  }
}
</script>

<template>
    <div class="h-full flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div class="relative">
        <div class="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg animate-pulse"></div>
        <div id="form-container" class="bg-white p-16 rounded-lg shadow-2xl w-80 relative z-10 transform transition duration-500 ease-in-out">
          <h2 id="form-title" class="text-center text-3xl font-bold mb-10 text-gray-800">Login</h2>
          <form class="space-y-5">
            <input class="w-full h-12 border border-gray-800 px-3 rounded-lg" placeholder="Email" id="" name="" type="text" v-model="accout">
            <input class="w-full h-12 border border-gray-800 px-3 rounded-lg" placeholder="Password" id="" name="" type="password" v-model="password">
            <button class="w-full h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer" @click.prevent="login">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  </template>
 