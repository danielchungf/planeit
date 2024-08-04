<template>
  <div class="bg-transparent mb-10">
    <div class="relative pb-[75%] bg-neutral-100 rounded-sm">
    </div>
    <div class="pt-3 flex font-cabinet font-medium text-lg">
      <div class="w-1/2 pr-4">
        <h3>{{ title }}</h3>
        <p class="font-regular text-neutral-500">{{ category }}</p>
      </div>
      <div class="w-1/2">
        <p class="font-regular text-neutral-700">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  category: String,
  description: String
})
</script>