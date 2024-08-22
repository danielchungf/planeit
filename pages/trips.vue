<template>
  <div class="flex h-screen">
    <!-- Content for sidebar starts -->
    <div class="w-[250px] bg-neutral-100 h-full border-r border-neutral-200 flex flex-col gap-6 p-5">
      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger @click="isDialogOpen = true" class="mb-3">
          <Button 
          class="hover:bg-neutral-800 hover:text-white transition-colors duration-300 w-full">
          <TicketsPlane />
          <span class="pl-2">Create a new trip</span>
          </Button>
        </DialogTrigger>
        <DialogContent class="w-[400px]">
          <DialogHeader class="mb-2">
            <DialogTitle>Create a new trip</DialogTitle>
          </DialogHeader>
          <label for="tripName" class="block text-sm font-medium text-gray-700">Name of the trip</label>
          <Input type="text" class="mb-2" placeholder="Trip to Yosemite National Park..." v-model="tripName" />
          <label for="destination" class="block text-sm font-medium text-gray-700">Destination</label>
          <Input type="text" class="mb-2" placeholder="Peru, Tokyo, Barcelona... " v-model="destination" />
          <label for="dates" class="block text-sm font-medium text-gray-700">Range of dates</label>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="cn(
                  'w-full justify-start text-left font-normal',
                  !value && 'text-muted-foreground',
                )"
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                <template v-if="value.start">
                  <template v-if="value.end">
                    {{ df.format(value.start.toDate(getLocalTimeZone())) }} - {{ df.format(value.end.toDate(getLocalTimeZone())) }}
                  </template>
                
                  <template v-else>
                    {{ df.format(value.start.toDate(getLocalTimeZone())) }}
                  </template>
                </template>
                <template v-else>
                  Pick a date
                </template>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <RangeCalendar v-model="value" initial-focus :number-of-months="2" @update:start-value="(startDate) => value.start = startDate" />
            </PopoverContent>
          </Popover>
          <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
          <Select class="" v-model="category">
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
          <DialogFooter class="mt-2">
            <Button type="submit" @click="createTrip" :disabled="!isFormValid">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1" v-if="ongoingTrips.length > 0">
          <h2 class="text-sm font-semibold mb-1">Ongoing trips</h2>
          <div v-for="trip in ongoingTrips" :key="trip.id" 
               @click="selectTrip(trip)"
               class="text-sm font-medium text-neutral-500 cursor-pointer hover:bg-neutral-200 p-2 rounded"
               :class="{ 'bg-neutral-200 text-neutral-700': selectedTrip?.id === trip.id }">
            {{ trip.name }}
          </div>
        </div>

        <div class="flex flex-col gap-1" v-if="upcomingTrips.length > 0">
          <h2 class="text-sm font-semibold mb-1">Upcoming trips</h2>
          <div v-for="trip in upcomingTrips" :key="trip.id" 
               @click="selectTrip(trip)"
               class="text-sm font-medium text-neutral-500 cursor-pointer hover:bg-neutral-200 p-2 rounded"
               :class="{ 'bg-neutral-200 text-neutral-700': selectedTrip?.id === trip.id }">
            {{ trip.name }}
          </div>
        </div>

        <div class="flex flex-col gap-1" v-if="pastTrips.length > 0">
          <h2 class="text-sm font-semibold mb-1">Past trips</h2>
          <div v-for="trip in pastTrips" :key="trip.id" 
               @click="selectTrip(trip)"
               class="text-sm font-medium text-neutral-500 cursor-pointer hover:bg-neutral-200 p-2 rounded"
               :class="{ 'bg-neutral-200 text-neutral-700': selectedTrip?.id === trip.id }">
            {{ trip.name }}
          </div>
        </div>

        <div v-if="!ongoingTrips.length && !upcomingTrips.length && !pastTrips.length" class="flex justify-center items-center text-sm font-medium text-gray-500">
          No trips created yet.
        </div>
      </div>
    </div>
    <!-- Content for the sidebar ends -->

    <!-- Content for the trip view starts -->
    <div class="flex-1 bg-white p-6">
      <div v-if="selectedTrip" class="space-y-4">
        <h1 class="text-2xl font-bold">{{ selectedTrip.name }}</h1>
        <p><strong>Destination:</strong> {{ selectedTrip.destination }}</p>
        <p><strong>Category:</strong> {{ selectedTrip.category }}</p>
        <p><strong>Date Range:</strong> {{ formatDateRange(selectedTrip) }}</p>
      </div>

      <div v-else class="flex justify-center items-center h-full text-sm font-medium text-neutral-400">
        Create or select a trip to start your planning.
      </div>
      
    </div>
    <!-- Content for the trip view ends -->

  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TicketsPlane } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/* start Date picker */
import { type Ref, ref, computed, onMounted } from 'vue'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  today,
  parseDate,
} from '@internationalized/date'

import { Calendar as CalendarIcon } from 'lucide-vue-next'
import type { DateRange } from 'radix-vue'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const value = ref({
  start: today(getLocalTimeZone()),
  end: today(getLocalTimeZone()).add({ days: 7 }),
}) as Ref<DateRange>
/* end Date picker */

interface Trip {
  id: string
  name: string
  destination: string
  startDate: CalendarDate
  endDate: CalendarDate
  category: string
}

// Form input reactive references
const tripName = ref('')
const destination = ref('')
const category = ref('')
const dateRange = ref({
  start: today(getLocalTimeZone()),
  end: today(getLocalTimeZone()).add({ days: 7 }),
})

// Lists to store trips by category
const ongoingTrips = ref<Trip[]>([])
const upcomingTrips = ref<Trip[]>([])
const pastTrips = ref<Trip[]>([])
const selectedTrip = ref<Trip | null>(null)

// Add this to manage dialog state
const isDialogOpen = ref(false)

// Computed property to check if all fields are filled
const isFormValid = computed(() => {
  return tripName.value.trim() !== '' &&
         destination.value.trim() !== '' &&
         category.value !== '' &&
         value.value.start && value.value.end
})

// Function to create and categorize a new trip
function createTrip() {
  const newTrip: Trip = {
    id: generateUniqueId(),
    name: tripName.value,
    destination: destination.value,
    startDate: value.value.start,
    endDate: value.value.end,
    category: category.value,
  }

  const now = today(getLocalTimeZone())

  if (newTrip.endDate.compare(now) >= 0 && newTrip.startDate.compare(now) <= 0) {
    ongoingTrips.value.push(newTrip)
  } else if (newTrip.startDate.compare(now) > 0) {
    upcomingTrips.value.push(newTrip)
  } else {
    pastTrips.value.push(newTrip)
  }

  saveTripsToLocalStorage()

  tripName.value = ''
  destination.value = ''
  category.value = ''
  value.value = {
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ days: 7 }),
  }

  isDialogOpen.value = false
  selectedTrip.value = newTrip
}

function selectTrip(trip: Trip) {
  selectedTrip.value = trip
}

function formatDateRange(trip: Trip) {
  const start = new Date(trip.startDate.toString())
  const end = new Date(trip.endDate.toString())
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveTripsToLocalStorage() {
  const tripsToSave = {
    ongoing: ongoingTrips.value.map(trip => ({
      ...trip,
      startDate: trip.startDate.toString(),
      endDate: trip.endDate.toString()
    })),
    upcoming: upcomingTrips.value.map(trip => ({
      ...trip,
      startDate: trip.startDate.toString(),
      endDate: trip.endDate.toString()
    })),
    past: pastTrips.value.map(trip => ({
      ...trip,
      startDate: trip.startDate.toString(),
      endDate: trip.endDate.toString()
    }))
  }
  localStorage.setItem('trips', JSON.stringify(tripsToSave))
}

function loadTripsFromLocalStorage() {
  const storedTrips = localStorage.getItem('trips')
  if (storedTrips) {
    const parsedTrips = JSON.parse(storedTrips)
    ongoingTrips.value = parsedTrips.ongoing.map(trip => ({
      ...trip,
      startDate: safeParseDateString(trip.startDate),
      endDate: safeParseDateString(trip.endDate)
    })) || []
    upcomingTrips.value = parsedTrips.upcoming.map(trip => ({
      ...trip,
      startDate: safeParseDateString(trip.startDate),
      endDate: safeParseDateString(trip.endDate)
    })) || []
    pastTrips.value = parsedTrips.past.map(trip => ({
      ...trip,
      startDate: safeParseDateString(trip.startDate),
      endDate: safeParseDateString(trip.endDate)
    })) || []
  }
}

function safeParseDateString(value: any): CalendarDate {
  if (value instanceof CalendarDate) {
    return value;
  }
  if (typeof value === 'string') {
    try {
      return parseDate(value);
    } catch (error) {
      console.error('Error parsing date string:', error);
      return today(getLocalTimeZone()); // fallback to today's date
    }
  }
  if (value && typeof value === 'object' && 'year' in value && 'month' in value && 'day' in value) {
    return new CalendarDate(value.year, value.month, value.day);
  }
  console.error('Invalid date value:', value);
  return today(getLocalTimeZone()); // fallback to today's date
}

onMounted(() => {
  loadTripsFromLocalStorage()
})
</script>

<style scoped>
/* You can add any additional styles here if needed */
</style>