<template>
  <div class="flex gap-8 p-10">
    
      <!-- Input Section -->
      <div class="flex flex-col gap-5 bg-white p-6 rounded-lg border border-gray-300 w-fill">
        <div class="w-full">
          <label for="tripName" class="block text-sm font-medium text-gray-700 mb-2">Name of the trip</label>
          <input type="text" id="tripName" v-model="tripName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8343]">
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700 mb-2">Date range</label>
          <DatePicker 
            v-model="dateRange" 
            is-range 
            color="orange"
            class="w-full [&_.vc-pane-container]:!w-full [&_.vc-weeks]:!w-full"
          />
        </div>
        <div class="w-full">
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select id="category" v-model="category" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8343]">
            <option value="">Select a category</option>
            <option value="Vacation">Vacation</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Family">Family</option>
          </select>
        </div>
        <button @click="createTrip" class="bg-[#FF8343] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#E67339] transition-colors duration-300">
          Create trip
        </button>
      </div>

    <!-- Display Section -->
    <div v-if="tripCreated" class="bg-white rounded-lg border border-gray-300 overflow-hidden w-[300px] h-[320px]">
      <div 
        class="h-full bg-cover bg-center flex flex-col justify-end" 
        :style="{ backgroundImage: `url(${getImageUrl('spain.png')})` }"
      >
        <div class="p-4 flex flex-col justify-center items-center gap-2">
          <h2 class="text-xl font-bold text-center">{{ createdTripName }}</h2>
          <p v-if="createdDateRange.start && createdDateRange.end" class="text-md text-gray-600 text-center">
            {{ formatDate(createdDateRange.start) }} – {{ formatDate(createdDateRange.end) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'

const tripName = ref('')
const dateRange = ref({
  start: null,
  end: null
})
const category = ref('')

const tripCreated = ref(false)
const createdTripName = ref('')
const createdDateRange = ref({
  start: null,
  end: null
})

function createTrip() {
  tripCreated.value = true
  createdTripName.value = tripName.value || 'Unnamed Trip'
  createdDateRange.value = { ...dateRange.value }
  console.log('Trip Created:', createdTripName.value, createdDateRange.value, category.value)
  // Add your trip creation logic here
}

function formatDate(date) {
  if (!date) return ''
  const options = { month: 'short', day: 'numeric', year: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}

function getImageUrl(name) {
  return new URL(`../assets/${name}`, import.meta.url).href
}
</script>

<style>
.vc-orange {
  --vc-accent-50: #fff7ed;
  --vc-accent-100: #ffedd5;
  --vc-accent-200: #fed7aa;
  --vc-accent-300: #fdba74;
  --vc-accent-400: #fb923c;
  --vc-accent-500: #f97316;
  --vc-accent-600: #ea580c;
  --vc-accent-700: #c2410c;
  --vc-accent-800: #9a3412;
  --vc-accent-900: #7c2d12;
}

</style>