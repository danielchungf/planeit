<template>
    <div class="bg-gray-100 p-4">
      <img :src="image" :alt="title" class="w-full h-auto">
      <h3 class="text-xl font-semibold mt-4 mb-2">{{ title }}</h3>
      <p class="text-gray-600 mb-2">{{ category }}</p>
      <p>{{ description }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    image: String,
    title: String,
    category: String,
    description: String
  })
  </script>