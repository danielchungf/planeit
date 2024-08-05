<template>
  <div class="bg-transparent mb-10">
    <a :href="link" target="_blank" rel="noopener noreferrer" class="block">
      <div class="relative pb-[56.25%] bg-neutral-100 rounded-sm overflow-hidden">
        <img :src="image" :alt="title" class="absolute inset-0 w-full h-full object-cover">
      </div>
    </a>
    <div class="pt-3 flex font-cabinet font-medium text-lg">
      <div class="md:w-1/2 w-2/5 leading-tight">
        <a :href="link" target="_blank" rel="noopener noreferrer">
          <h3 class="hover:text-[#FF621F] transition-colors">{{ title }}</h3>
        </a>
        <p class="font-regular text-neutral-500">{{ category }}</p>
      </div>
      <div class="md:w-1/2 w-3/5">
        <p class="font-regular text-neutral-700 leading-tight">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  category: String,
  description: String,
  image: String,
  link: String
})
</script>