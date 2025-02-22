<script setup>
import { RouterView } from 'vue-router'

</script>

<template>

    <el-container class="w-full h-full">
      <el-header class="bg-blueGray-100">
        <div class="flex justify-between items-center p-2 ml-5"> 
          <div class="text-2xl font-bold">
            人事管理系統
          </div>
        </div>
      </el-header>
      <el-main style="--el-main-padding: 0px;">
        <RouterView />
      </el-main>
    </el-container>
  


</template>

<style scoped>

</style>
