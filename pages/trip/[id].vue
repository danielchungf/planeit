<template>
  <div class="p-6">
    <NuxtLink to="/" class="mb-4 inline-block">
      <Button class="bg-neutral-200 hover:bg-neutral-300 text-gray-800">
        <ArrowLeft class="mr-2" /> Back to Trips
      </Button>
    </NuxtLink>
    <div v-if="loading">Loading...</div>
    <div v-else-if="trip" class="space-y-4">
      <h1 class="text-2xl font-bold">{{ trip.name }}</h1>
      <p><strong>Destination:</strong> {{ trip.destination }}</p>
      <p><strong>Category:</strong> {{ trip.category }}</p>
      <p><strong>Date Range:</strong> {{ formatDateRange(trip.dateRange) }}</p>
      
      <!-- Add more sections for trip planning here -->
      <h2 class="text-xl font-semibold mb-2">Trip Planning</h2>
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium">Accommodation</h3>
          <!-- Add accommodation planning details -->
        </div>
        <div>
          <h3 class="text-lg font-medium">Transportation</h3>
          <!-- Add transportation planning details -->
        </div>
        <div>
          <h3 class="text-lg font-medium">Activities</h3>
          <!-- Add activities planning details -->
        </div>
        <div>
          <h3 class="text-lg font-medium">Packing List</h3>
          <!-- Add packing list details -->
        </div>
      </div>
    </div>
    <div v-else class="text-red-500">
      Trip not found. Please check the URL and try again.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useHead } from 'nuxt/app'

const route = useRoute()
const trip = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const trips = JSON.parse(localStorage.getItem('trips') || '[]')
    trip.value = trips.find(t => t.id === route.params.id)
    if (!trip.value) {
      console.error('Trip not found')
      // You might want to redirect to a 404 page or show an error message
    }
  } catch (error) {
    console.error('Error fetching trip:', error)
  } finally {
    loading.value = false
  }
})

const formatDateRange = (dateRange) => {
  const start = new Date(dateRange.start)
  const end = new Date(dateRange.end)
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
}

useHead({
  title: computed(() => trip.value ? `${trip.value.name} - Trip Details` : 'Trip Details'),
  meta: [
    { name: 'description', content: computed(() => trip.value ? `Details for trip to ${trip.value.destination}` : 'Trip details page') }
  ]
})
</script>