<template>
  <div class="flex flex-row m-5 gap-5 items-start">
   
    <!-- Input Section -->
    <div class="inline-flex flex-col gap-2 bg-white p-6 rounded-lg border border-gray-300">
      <label for="tripName" class="block text-sm font-medium text-gray-700">Name of the trip</label>
      <Input v-model="tripName" type="text" class="mb-2" placeholder="Trip to Yosemite National Park..." />
      <label for="destination" class="block text-sm font-medium text-gray-700">Destination</label>
      <Input v-model="destination" type="text" class="mb-2" placeholder="Peru, Tokyo, Barcelona... " />
      <label class="w-full block text-sm font-medium text-gray-700">Date range</label>
      <RangeCalendar v-model="value" class="rounded-md border mb-2" />
      <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
      <Select v-model="selectedCategory" class="">
        <SelectTrigger>
          <SelectValue placeholder="Select the purpose of your trip" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Vacation">
              Vacation
            </SelectItem>
            <SelectItem value="Work">
              Work
            </SelectItem>
            <SelectItem value="Family">
              Family
            </SelectItem>
            <SelectItem value="Health">
              Health
            </SelectItem>
            <SelectItem value="Education">
              Education
            </SelectItem>
            <SelectItem value="Nature">
              Nature
            </SelectItem>
            <SelectItem value="Other">
              Other
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button 
        @click="createTrip" 
        class="hover:bg-neutral-800 hover:text-white transition-colors duration-300 mt-2"
        :disabled="!tripName || !destination || !selectedCategory || !value.start || !value.end"
      >
        <TicketsPlane />
        <span class="pl-2">Create a new trip</span>
      </Button>
    </div>

    <!-- Trips Section -->
   <div class="flex flex-col gap-8">
    <div v-if="ongoingTrips.length > 0" class="flex flex-col gap-5 flex-grow">
      <h2 class="text-2xl font-bold">Ongoing trips</h2>
      <div class="flex flex-wrap gap-4">
        <div v-for="(trip, index) in ongoingTrips" :key="index" 
             class="flex flex-col gap-1 bg-white px-4 py-4 rounded-lg border border-gray-300 w-[250px] h-auto relative group transition-all duration-300 ease-out"
             :class="{ 'animate-new-trip': trip.isNew, 'animate-delete-trip': trip.isDeleting }">
          <label class="block text-sm font-regular text-gray-400">{{ formatDateRange(trip.dateRange) }}</label>
          <title class="block text-xl font-medium text-gray-800">{{ trip.name }}</title>
          <label class="block text-sm font-regular text-gray-600">{{ trip.destination }} • {{ trip.category }}</label>
          <div class="w-fill flex items-center justify-end">
            <Button class="bg-neutral-200 hover:bg-neutral-300 text-gray-800 h-10 w-10 p-0 rounded-full">
              <ArrowRight />
            </Button>
            <Button 
              @click="deleteTrip(index)"
              class="absolute top-[-8px] right-[-8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full w-8 h-8 p-0 flex items-center justify-center"
            >
              <Trash2 class="text-white w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="upcomingTrips.length > 0" class="flex flex-col gap-5">
      <h2 class="text-2xl font-bold">Upcoming trips</h2>
      <div class="flex flex-wrap gap-4">
        <div v-for="(trip, index) in upcomingTrips" :key="index" 
             class="flex flex-col gap-1 bg-white px-4 py-4 rounded-lg border border-gray-300 w-[250px] h-auto relative group transition-all duration-300 ease-out"
             :class="{ 'animate-new-trip': trip.isNew, 'animate-delete-trip': trip.isDeleting }">
          <label class="block text-sm font-regular text-gray-400">{{ formatDateRange(trip.dateRange) }}</label>
          <title class="block text-xl font-medium text-gray-800">{{ trip.name }}</title>
          <label class="block text-sm font-regular text-gray-600">{{ trip.destination }} • {{ trip.category }}</label>
          <div class="w-fill flex items-center justify-end">
            <Button class="bg-neutral-200 hover:bg-neutral-300 text-gray-800 h-10 w-10 p-0 rounded-full">
              <ArrowRight />
            </Button>
            <Button 
              @click="deleteTrip(index)"
              class="absolute top-[-8px] right-[-8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full w-8 h-8 p-0 flex items-center justify-center"
            >
              <Trash2 class="text-white w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="pastTrips.length > 0" class="flex flex-col gap-5">
      <h2 class="text-2xl font-bold">Past trips</h2>
      <div class="flex flex-wrap gap-4">
        <div v-for="(trip, index) in pastTrips" :key="index" 
             class="flex flex-col gap-1 bg-white px-4 py-4 rounded-lg border border-gray-300 w-[250px] h-auto relative group transition-all duration-300 ease-out"
             :class="{ 'animate-new-trip': trip.isNew, 'animate-delete-trip': trip.isDeleting }">
          <label class="block text-sm font-regular text-gray-400">{{ formatDateRange(trip.dateRange) }}</label>
          <title class="block text-xl font-medium text-gray-800">{{ trip.name }}</title>
          <label class="block text-sm font-regular text-gray-600">{{ trip.destination }} • {{ trip.category }}</label>
          <div class="w-fill flex items-center justify-end">
            <Button class="bg-neutral-200 hover:bg-neutral-300 text-gray-800 h-10 w-10 p-0 rounded-full">
              <ArrowRight />
            </Button>
            <Button 
              @click="deleteTrip(index)"
              class="absolute top-[-8px] right-[-8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full w-8 h-8 p-0 flex items-center justify-center"
            >
              <Trash2 class="text-white w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!ongoingTrips.length && !upcomingTrips.length && !pastTrips.length" class="text-center text-gray-500">
      No trips planned yet. Create a new trip to get started!
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { TicketsPlane } from 'lucide-vue-next';
import { ArrowRight } from 'lucide-vue-next';
import { Trash2 } from 'lucide-vue-next';
import { ref, computed, onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'
import type { DateRange } from 'radix-vue'
import { getLocalTimeZone, today, parseDate, type DateValue } from '@internationalized/date'
import { RangeCalendar } from '@/components/ui/range-calendar'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Initialize the date range for the calendar
// 'start' is set to today's date in the local time zone
// 'end' is set to 7 days after the start date
// 'value' is a reactive reference holding this date range
const start = today(getLocalTimeZone())
const end = start.add({ days: 7 })
const value = ref({
  start,
  end,
}) as Ref<DateRange>

const tripName = ref('')
const destination = ref('')
const selectedCategory = ref('')
const trips = ref<any[]>([]) // Explicitly type trips as an array

// Load trips from localStorage on component mount
onMounted(() => {
  console.log('Component mounted')
  const savedTrips = localStorage.getItem('trips')
  console.log('Saved trips from localStorage:', savedTrips)
  if (savedTrips && savedTrips !== '""') {
    try {
      const parsedTrips = JSON.parse(savedTrips, (key, value) => {
        if (key === 'dateRange' && typeof value === 'object' && value !== null) {
          return {
            start: value.start ? parseDate(value.start) : null,
            end: value.end ? parseDate(value.end) : null
          }
        }
        return value
      })
      trips.value = Array.isArray(parsedTrips) ? parsedTrips : []
      console.log('Parsed trips:', trips.value)
    } catch (error) {
      console.error('Error parsing trips from localStorage:', error)
      trips.value = [] // Reset to empty array if parsing fails
    }
  } else {
    console.log('No saved trips found in localStorage')
    trips.value = [] // Ensure trips.value is an empty array if no saved trips
  }
})

// Watch for changes in trips and save to localStorage
watch(trips, (newValue) => {
  console.log('Trips changed:', newValue)
  saveTripsToLocalStorage()
}, { deep: true })

// Function to save trips to localStorage
const saveTripsToLocalStorage = () => {
  try {
    const tripsToSave = trips.value.map(trip => ({
      ...trip,
      dateRange: {
        start: trip.dateRange.start.toString(),
        end: trip.dateRange.end.toString()
      }
    }))
    const tripsString = JSON.stringify(tripsToSave)
    console.log('Saving trips to localStorage:', tripsString)
    localStorage.setItem('trips', tripsString)
    console.log('Trips saved successfully')
  } catch (error) {
    console.error('Error saving trips to localStorage:', error)
  }
}

const formattedDateRange = computed(() => {
  if (value.value.start && value.value.end) {
    const start = new Date(value.value.start.toString())
    const end = new Date(value.value.end.toString())
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
  return ''
})

const getCurrentDate = () => new Date()

// Modify the computed properties to handle potential non-array trips.value
const ongoingTrips = computed(() => {
  if (!Array.isArray(trips.value)) {
    console.error('trips.value is not an array:', trips.value)
    return []
  }
  return trips.value.filter(trip => {
    const endDate = new Date(trip.dateRange.end.toString())
    const startDate = new Date(trip.dateRange.start.toString())
    const currentDate = getCurrentDate()
    return endDate >= currentDate && startDate <= currentDate
  })
})

const upcomingTrips = computed(() => {
  if (!Array.isArray(trips.value)) {
    console.error('trips.value is not an array:', trips.value)
    return []
  }
  return trips.value.filter(trip => {
    const startDate = new Date(trip.dateRange.start.toString())
    const currentDate = getCurrentDate()
    return startDate > currentDate
  })
})

const pastTrips = computed(() => {
  if (!Array.isArray(trips.value)) {
    console.error('trips.value is not an array:', trips.value)
    return []
  }
  return trips.value.filter(trip => {
    const endDate = new Date(trip.dateRange.end.toString())
    const currentDate = getCurrentDate()
    return endDate < currentDate
  })
})

const createTrip = () => {
  if (!tripName.value || !destination.value || !selectedCategory.value || !value.value.start || !value.value.end) {
    return
  }

  const newTrip = {
    name: tripName.value,
    destination: destination.value,
    category: selectedCategory.value,
    dateRange: {
      start: value.value.start,
      end: value.value.end
    },
    isNew: true
  }

  console.log('Creating new trip:', newTrip)
  trips.value.push(newTrip)
  console.log('Updated trips:', trips.value)
  saveTripsToLocalStorage() // Call this explicitly after adding a new trip

  // Reset input values for the next trip
  tripName.value = ''
  destination.value = ''
  selectedCategory.value = ''
  value.value = {
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ days: 7 }),
  }

  // Remove the isNew property after animation
  setTimeout(() => {
    newTrip.isNew = false
    saveTripsToLocalStorage() // Save again after removing isNew
  }, 500)
}

const deleteTrip = (index: number) => {
  const deletedTrip = trips.value.splice(index, 1)[0]
  deletedTrip.isDeleting = true
  setTimeout(() => {
    deletedTrip.isDeleting = false
  }, 500)
  toast(deletedTrip.name + ' has been deleted', {
    description: formatDateRange(deletedTrip.dateRange),
    action: {
      label: 'Undo',
      onClick: () => undoDeleteTrip(deletedTrip),
    },
  })
}

const undoDeleteTrip = (trip) => {
  trip.isNew = true
  trips.value.push(trip)
  setTimeout(() => {
    trip.isNew = false
  }, 500)
}

const formatDateRange = (dateRange) => {
  const start = new Date(dateRange.start.toString())
  const end = new Date(dateRange.end.toString())
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}
</script>