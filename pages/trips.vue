<template>
  <div class="flex h-screen">
    <!-- Content for sidebar starts -->
    <div class="w-[250px] bg-neutral-100 h-full border-r border-neutral-200 flex flex-col gap-6 p-5">
      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger @click="openCreateDialog" class="mb-3">
          <Button 
          class="hover:bg-neutral-800 hover:text-white transition-colors duration-300 w-full">
          <TicketsPlane />
          <span class="pl-2">Create a new trip</span>
          </Button>
        </DialogTrigger>
        <DialogContent class="w-[400px]">
          <DialogHeader class="mb-2">
            <DialogTitle>{{ isEditing ? 'Edit trip' : 'Create a new trip' }}</DialogTitle>
          </DialogHeader>
          <label for="tripName" class="block text-sm font-medium text-gray-700">Name of the trip</label>
          <Input type="text" class="mb-2" placeholder="Trip to Yosemite National Park..." v-model="tripName" />
          <label for="destination" class="block text-sm font-medium text-gray-700">Destination</label>
          <TagsInput 
            v-model="currentDestinationTags"
          >
            <TagsInputItem v-for="item in currentDestinationTags" :key="item" :value="item">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
            <TagsInputInput 
              v-model="currentInputValue"
              class="placeholder:text-neutral-500" 
              :placeholder="currentDestinationTags.length === 0 ? 'Add cities or places separated by commas' : ''" 
            />
          </TagsInput>
          <label for="dates" class="block text-sm font-medium text-gray-700">Date range</label>
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
            <Button type="submit" @click="isEditing ? updateTrip() : createTrip()" :disabled="!isFormValid">
              {{ isEditing ? 'Update' : 'Create' }}
            </Button>
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
            {{ truncateName(trip.name) }}
          </div>
        </div>

        <div class="flex flex-col gap-1" v-if="upcomingTrips.length > 0">
          <h2 class="text-sm font-semibold mb-1">Upcoming trips</h2>
          <div v-for="trip in upcomingTrips" :key="trip.id" 
               @click="selectTrip(trip)"
               class="text-sm font-medium text-neutral-500 cursor-pointer hover:bg-neutral-200 p-2 rounded"
               :class="{ 'bg-neutral-200 text-neutral-700': selectedTrip?.id === trip.id }">
            {{ truncateName(trip.name) }}
          </div>
        </div>

        <div class="flex flex-col gap-1" v-if="pastTrips.length > 0">
          <h2 class="text-sm font-semibold mb-1">Past trips</h2>
          <div v-for="trip in pastTrips" :key="trip.id" 
               @click="selectTrip(trip)"
               class="text-sm font-medium text-neutral-500 cursor-pointer hover:bg-neutral-200 p-2 rounded"
               :class="{ 'bg-neutral-200 text-neutral-700': selectedTrip?.id === trip.id }">
            {{ truncateName(trip.name) }}
          </div>
        </div>

        <div v-if="!ongoingTrips.length && !upcomingTrips.length && !pastTrips.length" class="flex justify-center items-center text-sm font-medium text-gray-500">
          No trips created yet.
        </div>
      </div>
    </div>
    <!-- Content for the sidebar ends -->

    <!-- Content for the trip view starts -->
    <div class="flex-1 bg-white">
      <div v-if="selectedTrip" class="h-[110px] border-b flex flex-row px-6 justify-between pt-5">
        <div class="flex flex-col gap-3">
          <h1 class="text-2xl font-bold">{{ selectedTrip.name }}</h1>
          <div class="flex flex-row gap-2">
            <Badge :class="getCategoryColors(selectedTrip.category)">{{ selectedTrip.category }}</Badge>
            <Badge v-for="place in selectedTrip.destination" :key="place" class="bg-neutral-100 text-neutral-600 hover:bg-neutral-200">
              {{ place }}
            </Badge>
            <Popover v-model:open="isDatePopoverOpen">
              <PopoverTrigger asChild>
                <Badge class="bg-transparent border-neutral-300 text-neutral-600 hover:bg-transparent cursor-pointer">
                  {{ formatDateRange(selectedTrip) }}
                </Badge>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-4">
                <RangeCalendar 
                  v-model="editDateRange" 
                  :initial-focus="true"
                  :number-of-months="2"
                  @update:start-value="updateStartDate"
                  @update:end-value="updateEndDate"
                />
                <div class="mt-4 flex justify-end gap-2">
                  <Button @click="closePopover" variant="outline" size="sm">Cancel</Button>
                  <Button @click="saveDateRangeAndClose" size="sm">Save</Button>
                </div>
              </PopoverContent>
            </Popover>
            <Badge class="bg-neutral-100 text-neutral-600 hover:bg-neutral-200">{{ calculateDaysAndNights(selectedTrip) }}</Badge>
          </div>
    
        </div>
        <div class="flex flex-row gap-3 items-start">
          <Button 
                @click="openEditDialog"
                class="cursor-pointer rounded-full w-8 h-8 p-0 flex items-center justify-center bg-transparent border border-gray-300 hover:bg-neutral-100 hover:border-gray-300 group"
            >
                <Pencil class="text-gray-600 w-4 h-4 group-hover:text-gray-800 transition-colors duration-200" />
            </Button>  
          <AlertDialog>
                <AlertDialogTrigger>
                    <Button 
                class="cursor-pointer rounded-full w-8 h-8 p-0 flex items-center justify-center bg-transparent border border-gray-300 hover:bg-red-100 hover:border-red-200 group"
            >
                        <Trash2 class="text-gray-600 w-4 h-4 group-hover:text-red-500 transition-colors duration-200" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {{ selectedTrip.name }}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this trip and its data from our servers. Serious stuff!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction @click="deleteTrip">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
          </AlertDialog>
        </div>

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
import { Badge } from '@/components/ui/badge'
import { TicketsPlane } from 'lucide-vue-next'
import { Trash2 } from 'lucide-vue-next'
import { Pencil } from 'lucide-vue-next'
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

/* start City input */
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
/* end City input */


/* start Date picker */
import { type Ref, ref, computed, onMounted, watch } from 'vue'
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
  destination: string[]
  startDate: CalendarDate
  endDate: CalendarDate
  category: string
}

// Form input reactive references
const tripName = ref('')
const destinationTags = ref<string[]>([])
const inputValue = ref('')
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
const isEditing = ref(false)
const isDatePopoverOpen = ref(false)

// Computed property to check if all fields are filled
const isFormValid = computed(() => {
  return tripName.value.trim() !== '' &&
         category.value !== '' &&
         value.value.start && value.value.end
})

// Function to create and categorize a new trip
function createTrip() {
  const newTrip: Trip = {
    id: generateUniqueId(),
    name: tripName.value,
    destination: destinationValue.value,
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

  resetForm()
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

function calculateDaysAndNights(trip: Trip) {
  const start = new Date(trip.startDate.toString())
  const end = new Date(trip.endDate.toString())
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const days = diffDays
  const nights = days - 1
  return `${days} day${days !== 1 ? 's' : ''}, ${nights} night${nights !== 1 ? 's' : ''}`
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
    try {
      const parsedTrips = JSON.parse(storedTrips)
      ongoingTrips.value = (parsedTrips.ongoing || []).map(trip => ({
        ...trip,
        startDate: safeParseDateString(trip.startDate),
        endDate: safeParseDateString(trip.endDate)
      }))
      upcomingTrips.value = (parsedTrips.upcoming || []).map(trip => ({
        ...trip,
        startDate: safeParseDateString(trip.startDate),
        endDate: safeParseDateString(trip.endDate)
      }))
      pastTrips.value = (parsedTrips.past || []).map(trip => ({
        ...trip,
        startDate: safeParseDateString(trip.startDate),
        endDate: safeParseDateString(trip.endDate)
      }))
    } catch (error) {
      console.error('Error parsing stored trips:', error)
      ongoingTrips.value = []
      upcomingTrips.value = []
      pastTrips.value = []
    }
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

function deleteTrip() {
  if (selectedTrip.value) {
    ongoingTrips.value = ongoingTrips.value.filter(trip => trip.id !== selectedTrip.value?.id)
    upcomingTrips.value = upcomingTrips.value.filter(trip => trip.id !== selectedTrip.value?.id)
    pastTrips.value = pastTrips.value.filter(trip => trip.id !== selectedTrip.value?.id)

    saveTripsToLocalStorage()

    selectedTrip.value = null
  }
}

function getCategoryColors(category: string) {
  switch (category.toLowerCase()) {
    case 'vacation':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-200'
    case 'work':
      return 'bg-red-100 text-red-800 hover:bg-red-200'
    case 'family':
      return 'bg-sky-100 text-sky-800 hover:bg-sky-200'
    case 'health':
      return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
    case 'education':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200'
    case 'nature':
      return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
    default:
      return 'bg-rose-100 text-rose-800 hover:bg-rose-200' // for 'Other' or any undefined category
  }
}

function openCreateDialog() {
  isEditing.value = false
  resetForm()
  isDialogOpen.value = true
}

function openEditDialog() {
  if (selectedTrip.value) {
    isEditing.value = true
    tripName.value = selectedTrip.value.name
    tempDestinationTags.value = [...selectedTrip.value.destination]
    tempInputValue.value = ''
    category.value = selectedTrip.value.category
    value.value = {
      start: selectedTrip.value.startDate,
      end: selectedTrip.value.endDate
    }
    isDialogOpen.value = true
  }
}

function resetForm() {
  tripName.value = ''
  destinationTags.value = []
  inputValue.value = ''
  tempDestinationTags.value = []
  tempInputValue.value = ''
  category.value = ''
  value.value = {
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ days: 7 }),
  }
  isEditing.value = false
}

function updateTrip() {
  if (selectedTrip.value) {
    const updatedTrip: Trip = {
      ...selectedTrip.value,
      name: tripName.value,
      destination: destinationValue.value,
      startDate: value.value.start,
      endDate: value.value.end,
      category: category.value,
    }

    // Update the trip in the appropriate list
    const lists = [ongoingTrips, upcomingTrips, pastTrips]
    lists.forEach(list => {
      const index = list.value.findIndex(trip => trip.id === updatedTrip.id)
      if (index !== -1) {
        list.value[index] = updatedTrip
      }
    })

    selectedTrip.value = updatedTrip
    saveTripsToLocalStorage()
    isDialogOpen.value = false
    isEditing.value = false
  }
}

function truncateName(name: string, maxLength: number = 30): string {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength) + '...';
}

const editDateRange = ref({
  start: null,
  end: null
})

watch(() => selectedTrip.value, (newTrip) => {
  if (newTrip) {
    editDateRange.value = {
      start: newTrip.startDate,
      end: newTrip.endDate
    }
  }
}, { immediate: true })

function updateStartDate(date) {
  editDateRange.value.start = date
}

function updateEndDate(date) {
  editDateRange.value.end = date
}

function saveDateRange() {
  if (selectedTrip.value && editDateRange.value.start && editDateRange.value.end) {
    selectedTrip.value.startDate = editDateRange.value.start
    selectedTrip.value.endDate = editDateRange.value.end

    // Update the trip in the appropriate list
    const lists = [ongoingTrips, upcomingTrips, pastTrips]
    lists.forEach(list => {
      const index = list.value.findIndex(trip => trip.id === selectedTrip.value?.id)
      if (index !== -1) {
        list.value[index] = { ...selectedTrip.value }
      }
    })

    saveTripsToLocalStorage()
  }
}

function closePopover() {
  isDatePopoverOpen.value = false
}

function saveDateRangeAndClose() {
  saveDateRange()
  closePopover()
}

const tempDestinationTags = ref<string[]>([])
const tempInputValue = ref('')

const currentInputValue = computed({
  get() {
    return isEditing.value ? tempInputValue.value : inputValue.value
  },
  set(newValue) {
    if (isEditing.value) {
      tempInputValue.value = newValue
    } else {
      inputValue.value = newValue
    }
  }
})

const currentDestinationTags = computed({
  get() {
    return isEditing.value ? tempDestinationTags.value : destinationTags.value
  },
  set(newValue) {
    if (isEditing.value) {
      tempDestinationTags.value = newValue
    } else {
      destinationTags.value = newValue
    }
  }
})

const destinationValue = computed(() => {
  const allValues = isEditing.value ? [...tempDestinationTags.value] : [...destinationTags.value]
  const inputToCheck = isEditing.value ? tempInputValue.value : inputValue.value
  if (inputToCheck.trim()) {
    allValues.push(inputToCheck.trim())
  }
  return allValues
})

onMounted(() => {
  loadTripsFromLocalStorage()
})
</script>

<style scoped>
/* You can add any additional styles here if needed */
</style>