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
            <Button @click="createTrip" class="hover:bg-[#FF8343] hover:text-white transition-colors duration-300 mt-2">
                <TicketsPlane />
                <span class="pl-2">Create a new trip</span>
            </Button>
        </div>

        <div v-if="isTripCreated" class="flex flex-col gap-1 bg-white px-4 py-4 rounded-lg border border-gray-300 w-[250px] h-auto relative group">
            <label class="block text-sm font-regular text-gray-400">{{ formattedDateRange }}</label>
            <title class="block text-xl font-medium text-gray-800">{{ displayedTripName }}</title>
            <label class="block text-sm font-medium text-gray-700">{{ displayedDestination }} • {{ displayedCategory }}</label>
          <div class="w-fill flex items-center justify-end">
            <Button class="bg-neutral-200 hover:bg-[#FF8343] text-gray-800 hover:text-white h-10 w-10 p-0 rounded-full">
            <ArrowRight />
          </Button>
          <Button  @click="deleteTrip" class="absolute top-[-8px] right-[-8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full w-8 h-8 p-0 flex items-center justify-center">
          <Trash2 class= "text-white w-4 h-4" />
        </Button>
        </div>
        </div>  
    </div>
</template>

<script setup lang="ts">
import { TicketsPlane } from 'lucide-vue-next';
import { ArrowRight } from 'lucide-vue-next';
import { Trash2 } from 'lucide-vue-next';
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { DateRange } from 'radix-vue'
import { getLocalTimeZone, today } from '@internationalized/date'
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
const displayedTripName = ref('Create a new trip')
const destination = ref('')
const displayedDestination = ref('')
const selectedCategory = ref('')
const displayedCategory = ref('')
const isTripCreated = ref(false)

const formattedDateRange = computed(() => {
  if (value.value.start && value.value.end) {
    const start = new Date(value.value.start.toString())
    const end = new Date(value.value.end.toString())
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
  return ''
})

const createTrip = () => {
  // Save current values to display
  displayedTripName.value = tripName.value || 'Create a new trip'
  displayedDestination.value = destination.value
  displayedCategory.value = selectedCategory.value
  isTripCreated.value = true
  
  // Reset input values for the next trip
  tripName.value = ''
  destination.value = ''
  selectedCategory.value = ''
  value.value = {
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ days: 7 }),
  }
}

const deleteTrip = () => {
  isTripCreated.value = false
}
</script>