<template>
  <div class="flex h-screen">
    <!-- Content for left sidebar starts -->
    <div :class="[
      'bg-neutral-100 h-full border-r border-neutral-200 flex flex-col gap-6 transition-all duration-300',
      isSidebarCollapsed ? 'w-[60px] items-center p-5' : 'w-[250px] p-5'
    ]">
      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger @click="openCreateDialog" :class="[
          'mb-3',
          isSidebarCollapsed ? 'w-10 h-10 p-0' : 'w-full'
        ]">
          <Button :class="[
            'hover:bg-neutral-800 hover:text-white transition-colors duration-300',
            isSidebarCollapsed ? 'w-10 h-10 p-0 justify-center' : 'w-full'
          ]">
            <TicketsPlane :class="isSidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5'" />
            <span v-if="!isSidebarCollapsed" class="pl-2">Create a new trip</span>
          </Button>
        </DialogTrigger>
        <DialogContent class="w-[400px]">
          <DialogHeader class="mb-2">
            <DialogTitle>{{ isEditing ? 'Edit trip' : 'Create a new trip' }}</DialogTitle>
          </DialogHeader>
          <div class="flex flex-col gap-2">
            <!-- Add this hidden input -->
            <input type="text" class="hidden" autofocus>
            
            <div v-if="isEditing" class="flex flex-col gap-2">
              <label for="tripName" class="block text-sm font-medium text-gray-700">Name of the trip</label>
              <Input 
                v-model="editTripName"
                placeholder="Enter trip name"
                class="w-full"
                ref="tripNameInput"
              />
            </div>
            <div class="flex flex-col gap-2 mb-2">
              <label for="destinations" class="block text-sm font-medium text-gray-700">Destinations</label>
              <div class="flex flex-row gap-2 items-center w-full">
                <Input 
                  v-model="currentInputValue"
                  placeholder="Country, city, place..."
                  class="flex-grow"
                  @keyup.enter="addDestination"
                />
                <Button @click="addDestination" :disabled="!currentInputValue.trim()">
                  <Plus />
                </Button>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mb-2">
              <Badge 
                v-for="place in currentDestinationTags" 
                :key="place" 
                class="bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              >
                {{ place }}
                <button @click="removeDestination(place)" class="ml-1.5 text-neutral-400 hover:text-neutral-600">
                  &times;
                </button>
              </Badge>
            </div>
            <div class="flex flex-col gap-2">
              <label for="dates" class="block text-sm font-medium text-gray-700">Date range</label>
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    :class="cn(
                      'w-full justify-start text-left font-normal',
                      !value.start && 'text-muted-foreground'
                    )"
                  >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ value.start && value.end
                      ? `${formatDateForDisplay(value.start)} - ${formatDateForDisplay(value.end)}`
                      : 'Pick a date'
                    }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <RangeCalendar 
                    v-model="value" 
                    initial-focus 
                    :number-of-months="1" 
                    @update:model-value="updateDateRange"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div class="flex flex-col gap-2">
              <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
              <Select class="" v-model="category">
                <SelectTrigger>
                  <SelectValue placeholder="Select the purpose of your trip" />
                </SelectTrigger>
                <SelectContent>
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
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter class="mt-2">
            <Button type="submit" @click="isEditing ? updateTrip() : createTrip()" :disabled="!isFormValid">
              {{ isEditing ? 'Update' : 'Create' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div v-if="!isSidebarCollapsed" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1" v-if="ongoingTrips.length > 0">
          <h2 class="text-sm font-semibold mb-1">Ongoing trips</h2>
          <div v-for="trip in ongoingTrips" :key="trip.id" 
               @click="selectTrip(trip)"
               class="text-sm font-medium text-neutral-500 cursor-pointer hover:bg-neutral-200 p-2 rounded overflow-hidden whitespace-nowrap text-ellipsis"
               :class="{ 'bg-neutral-200 text-neutral-700': selectedTrip?.id === trip.id }">
            {{ trip.name }}
          </div>
        </div>

        <div class="flex flex-col gap-1" v-if="upcomingTrips.length > 0">
          <h2 class="text-sm font-semibold mb-1">Upcoming trips</h2>
          <div v-for="trip in upcomingTrips" :key="trip.id" 
               @click="selectTrip(trip)"
               class="text-sm font-medium text-neutral-500 cursor-pointer hover:bg-neutral-200 p-2 rounded overflow-hidden whitespace-nowrap text-ellipsis"
               :class="{ 'bg-neutral-200 text-neutral-700': selectedTrip?.id === trip.id }">
            {{ trip.name }}
          </div>
        </div>

        <div class="flex flex-col gap-1" v-if="pastTrips.length > 0">
          <h2 class="text-sm font-semibold mb-1">Past trips</h2>
          <div v-for="trip in pastTrips" :key="trip.id" 
               @click="selectTrip(trip)"
               class="text-sm font-medium text-neutral-500 cursor-pointer hover:bg-neutral-200 p-2 rounded overflow-hidden whitespace-nowrap text-ellipsis"
               :class="{ 'bg-neutral-200 text-neutral-700': selectedTrip?.id === trip.id }">
            {{ trip.name }}
          </div>
        </div>

        <div v-if="!ongoingTrips.length && !upcomingTrips.length && !pastTrips.length" class="flex justify-center items-center text-sm font-medium text-gray-500">
          No trips created yet.
        </div>
      </div>

      <!-- Spacer to push the buttons to the bottom -->
      <div class="flex-grow"></div>

      <!-- Buttons container -->
      <div :class="[
        'flex',
        isSidebarCollapsed ? 'flex-col items-center gap-4' : 'justify-start'
      ]">
        <!-- Toggle sidebar button -->
        <Button 
          @click="toggleSidebar"
          class="w-10 h-10 p-0 bg-transparent hover:bg-neutral-200 transition-colors duration-300 text-neutral-600"
        >
          <ArrowLeftFromLine v-if="!isSidebarCollapsed" class="w-5 h-5" />
          <ArrowRightFromLine v-else class="w-5 h-5" />
        </Button>
      </div>
    </div>
    <!-- Content for the left sidebar ends -->

    <!-- Content for the trip view starts -->
    <div class="flex-1 bg-white">
      <div v-if="selectedTrip">
        <div class="h-[110px] border-b flex flex-row px-6 justify-between pt-5">
        <div class="flex flex-col gap-3">
          <h1 class="text-2xl font-bold">{{ selectedTrip.name }}</h1>
          <div class="flex flex-row gap-2">
            <Badge :class="getCategoryColors(selectedTrip.category)">{{ selectedTrip.category }}</Badge>
            <Badge v-for="place in selectedTrip.destination" :key="place" class="bg-neutral-100 text-neutral-600 hover:bg-neutral-200">
              {{ place }}
            </Badge>
            <Popover v-model:open="isDatePopoverOpen">
              <PopoverTrigger as-child>
                <Badge class="bg-transparent border-neutral-300 text-neutral-600 hover:bg-transparent cursor-pointer">
                  {{ formatDateRange(selectedTrip) }}
                </Badge>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-4">
                <RangeCalendar 
                  v-model="tripEditDateRange" 
                  :initial-focus="true"
                  :number-of-months="1"
                  @update:model-value="updateTripEditDateRange"
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
        <div class="h-[calc(100vh-110px)] flex flex-col gap-3 overflow-y-auto">
          <div v-if="selectedTrip" class="">
            <ResizablePanelGroup direction="horizontal" class="">
              <ResizablePanel class="flex flex-col gap-5 p-5 pl-6" :default-size="70">
                <div class="flex flex-row gap-2">
                  <Button 
                    @click="openAccommodationDialog"
                    class="hover:bg-neutral-800 hover:text-white transition-colors duration-300 flex flex-row"
                  >
                    <BedDouble class="app" :stroke-width="2" />
                    <span class="pl-2">Add accommodation</span>
                  </Button>
                </div>           
                <div v-for="(day, index) in tripDays" :key="index"> <!-- Maintained existing margin -->
                  <div 
                    @click="toggleDayPlans(index)"
                    class="bg-neutral-50 p-4 rounded-lg flex flex-row justify-between items-center border border-neutral-200 group"
                    :class="{'cursor-pointer': getDayPlans(index).length > 0}"
                  >
                    <h3 class="text-md font-semibold">{{ formatDayLabel(day, index) }}</h3>
                    <div v-if="getDayPlans(index).length > 0" class="flex items-center">
                      <span class="text-sm text-gray-500 mr-2 select-none">
                        {{ getDayPlans(index).length === 1 ? '1 plan' : `${getDayPlans(index).length} plans` }}
                      </span>
                      <ChevronDown 
                        :class="{'transform rotate-180': expandedDays[index]}"
                        class="w-5 h-5 text-gray-500 transition-transform duration-200"
                      />
                    </div>
                  </div>
                  <!-- Add this section to display assigned places -->
                  <div 
                    v-if="getDayPlans(index).length > 0 && expandedDays[index]"
                    class="space-y-2 ml-4 mt-2"
                  > <!-- Maintained existing margin and spacing -->
                    <div v-for="place in getDayPlans(index)" :key="place.id" 
                         class="flex flex-col border border-neutral-200 rounded-lg mt-2 group relative bg-white p-4">
                      <div class="flex flex-col gap-1">
                        <div class="text-sm font-medium pr-8">
                          <div v-if="place.isGoogleMapsPlace" class="flex flex-row gap-1 items-center">
                            <a 
                              :href="place.originalUrl" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              class="text-blue-500 hover:text-blue-700 hover:underline"
                            >
                              {{ place.name }}
                            </a>
                            <Button 
                              v-if="place.isGoogleMapsPlace"
                              @click="toggleMapPreview(place)" 
                              class="bg-transparent w-8 h-8 p-0 hover:bg-transparent text-neutral-400 hover:text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <MapPinned class="h-4 w-4" />
                            </Button>
                          </div>
                          <template v-else>
                            {{ place.name }}
                          </template>
                        </div>
                        <div v-if="place.address !== 'No address provided'" class="text-sm font-normal text-gray-500">{{ place.address }}</div>
                        <div v-if="place.comments" class="text-sm font-normal text-gray-500">{{ place.comments }}</div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            class="absolute top-[-10px] left-[-10px] cursor-pointer rounded-full w-8 h-8 p-0 flex items-center justify-center bg-white border border-gray-300 hover:bg-neutral-100 hover:border-gray-300 group opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <Forward class="text-gray-600 w-4 h-4 group-hover:text-gray-800 transition-colors duration-200" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent class="w-56 max-h-[300px] overflow-y-auto">
                          <DropdownMenuItem @click="unassignPlace(place, index)" class="text-gray-500">
                            Unassign
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem v-for="(otherDay, otherIndex) in tripDays" :key="otherIndex" @click="reassignPlace(place, index, otherIndex)" v-if="otherIndex !== index">
                            {{ formatDayLabel(otherDay, otherIndex) }}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <div v-if="place.isGoogleMapsPlace && place.showPreview" class="mt-2">
                        <iframe
                          :src="place.previewUrl"
                          width="100%" 
                          height="200" 
                          style="border:0;" 
                          allowfullscreen="" 
                          loading="lazy" 
                          referrerpolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>

              </ResizablePanel>
              <ResizableHandle class="ml-5 h-full" />
              <ResizablePanel class="p-5 pr-6 pl-5 bg-white text-md font-semibold min-w-[350px]" :default-size="30">
                
                <div class="flex flex-col gap-5">

                  <div class="border p-4 rounded-md flex flex-col gap-4 relative">

                    <Tabs default-value="manual" class="w-full">
                      <TabsList class="w-full">
                        <TabsTrigger value="manual" class="flex-1">
                          Manual
                        </TabsTrigger>
                        <TabsTrigger value="google-maps" class="flex-1">
                          Google Maps
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="manual" class="pt-4">
                        <div class="w-full space-y-4">
                          <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">Title</label>
                            <Input 
                              v-model="planTitle"
                              placeholder="Lunch at Pacha's Coffee"
                              class="w-full font-normal"
                            />
                          </div>
                          <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">Address (optional)</label>
                            <Input 
                              v-model="planAddress"
                              placeholder="149 Yellow Avenue, New York"
                              class="w-full font-normal" 
                            />
                          </div>
                          <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">Comments (optional)</label>
                            <Input 
                              v-model="planComments"
                              placeholder="Order their purple corn drink"
                              class="w-full font-normal" 
                            />
                          </div>
                          <Button 
                            @click="addManualPlan"
                            :disabled="!isManualPlanValid"
                            class="w-full hover:bg-neutral-800 hover:text-white transition-colors duration-300 flex items-center justify-center" 
                          >
                            <Bike class="mr-2" :stroke-width="2" />
                            <span>Add plans</span>
                          </Button>
                        </div>
                      </TabsContent>
                      <TabsContent value="google-maps" class="pt-4">
                        <div class="w-full space-y-4">
                          <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">Google Maps link</label>
                            <Input 
                              v-model="placeLink" 
                              placeholder="https://www.google.com/maps/..." 
                              class="w-full font-normal"
                            />
                          </div>
                          <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">Comments (optional)</label>
                            <Input 
                              placeholder="Order their purple corn drink"
                              class="w-full font-normal" 
                            />
                          </div>
                          <Button 
                            @click="addPlace" 
                            :disabled="!isValidGoogleMapsLink"
                            class="w-full hover:bg-neutral-800 hover:text-white transition-colors duration-300 flex items-center justify-center" 
                          >
                            <Bike class="mr-2" :stroke-width="2" />
                            <span>Add plans</span>
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  
                  </div>
                
                  <!-- List of added places -->
                  <div v-for="place in unassignedPlaces" :key="place.id" class="flex flex-col border border-neutral-200 rounded-lg mt-2 group relative">
                    <div class="p-4">
                      <div class="flex flex-col gap-1">
                        <div class="text-sm font-medium pr-8"> <!-- Added right padding to prevent text overlap with buttons -->
                          <div v-if="place.isGoogleMapsPlace" class="flex flex-row gap-1 items-center">
                            <a 
                              :href="place.originalUrl" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              class="text-blue-500 hover:text-blue-700 hover:underline"
                            >
                              {{ place.name }}
                            </a>
                            <Button 
                              v-if="place.isGoogleMapsPlace"
                              @click="toggleMapPreview(place)" 
                              class="bg-transparent w-8 h-8 p-0 hover:bg-transparent text-neutral-400 hover:text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <MapPinned class="h-4 w-4" />
                            </Button>
                          </div>
                          <template v-else>
                            {{ place.name }}
                          </template>
                        </div>
                        <div v-if="place.address !== 'No address provided'" class="text-sm font-normal text-gray-500">{{ place.address }}</div>
                        <div v-if="place.comments" class="text-sm font-normal text-gray-500">{{ place.comments }}</div>
                      </div>
                    </div>
                    
                    <Button 
                      @click="deletePlace(place)" 
                      class="absolute top-[-10px] right-[-10px] cursor-pointer rounded-full w-8 h-8 p-0 flex items-center justify-center bg-white border border-gray-300 hover:bg-red-100 hover:border-red-200 group opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Trash2 class="text-gray-600 w-4 h-4 group-hover:text-red-500 transition-colors duration-200" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          class="absolute top-[-10px] left-[-10px] cursor-pointer rounded-full w-8 h-8 p-0 flex items-center justify-center bg-white border border-gray-300 hover:bg-neutral-100 hover:border-gray-300 group opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Undo2 class="text-gray-600 w-4 h-4 group-hover:text-gray-800 transition-colors duration-200" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent class="w-56 max-h-[300px] overflow-y-auto">
                        <DropdownMenuItem v-for="(day, index) in tripDays" :key="index" @click="assignPlaceToDay(place, index)">
                          {{ formatDayLabel(day, index) }}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div v-if="place.isGoogleMapsPlace && place.showPreview" class="mt-2">
                      <iframe
                        :src="place.previewUrl"
                        width="100%" 
                        height="200" 
                        style="border:0;" 
                        allowfullscreen="" 
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                
                </div>

                  <!-- Packing list starts -->
                  <!-- <div class="flex flex-col gap-2 w-full">
                    <h3 class="text-md font-semibold">Packing list</h3>
                    <div class="grid grid-cols-[1fr,auto] gap-2 items-center w-full">
                      <Input 
                        v-model="newPackingItem" 
                        placeholder="Add item to pack..." 
                        class="w-full min-w-0 placeholder:text-neutral-500 placeholder:font-normal font-normal"
                        @keyup.enter="addPackingItem"
                      />
                      <Button @click="addPackingItem" class="whitespace-nowrap">
                        <Backpack />
                      </Button>
                    </div>
                  </div>
                  <div class="flex flex-col mt-3">
                    <div 
                      v-for="item in packingList" 
                      :key="item.id" 
                      class="flex flex-row gap-2 items-center group h-[30px]"
                    >
                      <Checkbox 
                        :checked="item.packed"
                        @update:checked="togglePackedStatus(item.id)" 
                      />
                      <span 
                        :class="{'line-through': item.packed}" 
                        class="text-sm font-normal flex-grow transition-all duration-200"
                      >
                        {{ item.name }}
                      </span>
                      <Button 
                        size="icon" 
                        @click="removePackingItem(item.id)" 
                        class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-none hover:bg-transparent"
                      >
                        <Trash2 class="h-4 w-4 text-neutral-400 hover:text-red-500" />
                      </Button>
                    </div>
                  </div> -->
                  <!-- Packing list ends -->

                
              
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>

      <div v-else class="flex justify-center items-center h-full text-sm font-medium text-neutral-400">
        Create or select a trip to start your planning.
      </div>
      
    </div>
    <!-- Content for the trip view ends -->

    <!-- Accommodation dialog -->
    <Dialog v-model:open="isAccommodationDialogOpen">
      <DialogContent class="w-[400px]">
        <DialogHeader>
          <DialogTitle>Add accommodation</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div class="flex flex-col gap-2">
            <label for="accommodationName" class="block text-sm font-medium text-gray-700">Name of the place</label>
            <Input 
              v-model="accommodationName"
              placeholder="Enter accommodation name"
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="accommodationAddress" class="block text-sm font-medium text-gray-700">Full address</label>
            <Input 
              v-model="accommodationAddress"
              placeholder="Enter full address"
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="accommodationDates" class="block text-sm font-medium text-gray-700">Check-in and Check-out dates</label>
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
                    <template v-if="selectedTrip">
                      {{ df.format(selectedTrip.startDate.toDate(getLocalTimeZone())) }} - {{ df.format(selectedTrip.endDate.toDate(getLocalTimeZone())) }}
                    </template>
                    <template v-else>
                      Pick a date
                    </template>
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <RangeCalendar v-model="value" initial-focus :number-of-months="1" @update:start-value="(startDate) => value.start = startDate" />
                </PopoverContent>
              </Popover>
          </div>
          <div class="flex flex-col gap-2">
            <label for="accommodationType" class="block text-sm font-medium text-gray-700">Type</label>
            <Select v-model="accommodationType">
              <SelectTrigger>
                <SelectValue placeholder="Select accommodation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="airbnb">Airbnb</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="hostel">Hostel</SelectItem>
                <SelectItem value="hostel">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter class="mt-4">
          <Button @click="addAccommodation" :disabled="!isAccommodationFormValid">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { TicketsPlane } from 'lucide-vue-next'
import { Backpack } from 'lucide-vue-next'
import { Plus } from 'lucide-vue-next'
import { Eraser } from 'lucide-vue-next'
import { BedDouble } from 'lucide-vue-next'
import { Trash2 } from 'lucide-vue-next'
import { Pencil } from 'lucide-vue-next'
import { Bike } from 'lucide-vue-next'
import { Castle } from 'lucide-vue-next';
import { MapPinned } from 'lucide-vue-next';
import { Map } from 'lucide-vue-next';
import { Separator } from '@/components/ui/separator'
import { Star } from 'lucide-vue-next';
import { Minus } from 'lucide-vue-next';
import { ArrowLeftFromLine } from 'lucide-vue-next';
import { ArrowRightFromLine } from 'lucide-vue-next';
import { Forward, Undo2 } from 'lucide-vue-next'
import { ChevronDown } from 'lucide-vue-next';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

/* start Date picker */
import { type Ref, ref, computed, onMounted, watch, nextTick } from 'vue'
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
import loader from '@/googleMapsLoader'

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const value = ref({
  start: null,
  end: null
})

function formatDateForDisplay(date) {
  if (!date) return ''
  return formatDate(date.toDate(getLocalTimeZone()))
}

function updateDateRange(newValue) {
  value.value = newValue
}
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
const tripEditDateRange = ref({ start: null, end: null })

// Computed property to check if all fields are filled
const isFormValid = computed(() => {
  if (isEditing.value) {
    return editTripName.value.trim() !== '' && 
           currentDestinationTags.value.length > 0 &&
           value.value.start &&
           value.value.end &&
           category.value !== ''
  } else {
    return currentDestinationTags.value.length > 0 &&
           value.value.start &&
           value.value.end &&
           category.value !== ''
  }
})

// Function to create and categorize a new trip
function createTrip() {
  const destinations = currentDestinationTags.value;
  let tripName = 'Trip to ';
  if (destinations.length === 1) {
    tripName += destinations[0];
  } else if (destinations.length === 2) {
    tripName += `${destinations[0]} and ${destinations[1]}`;
  } else if (destinations.length > 2) {
    tripName += destinations.slice(0, -1).join(', ') + ' and ' + destinations[destinations.length - 1];
  }

  const newTrip: Trip = {
    id: generateUniqueId(),
    name: tripName,
    destination: destinations,
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
  tripEditDateRange.value = {
    start: trip.startDate,
    end: trip.endDate
  }
}

function formatDateRange(trip: Trip) {
  if (!trip || !trip.startDate || !trip.endDate) return 'No date set';
  return `${formatDateForDisplay(trip.startDate)} - ${formatDateForDisplay(trip.endDate)}`;
}

function calculateDaysAndNights(trip: Trip) {
  const start = trip.startDate.toDate(getLocalTimeZone())
  const end = trip.endDate.toDate(getLocalTimeZone())
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
    editTripName.value = selectedTrip.value.name
    currentDestinationTags.value = [...selectedTrip.value.destination]
    currentInputValue.value = ''
    category.value = selectedTrip.value.category
    value.value = {
      start: selectedTrip.value.startDate,
      end: selectedTrip.value.endDate
    }
    isDialogOpen.value = true

    // Use nextTick to ensure the DOM has updated
    nextTick(() => {
      if (tripNameInput.value) {
        tripNameInput.value.blur()
      }
    })
  }
}

function resetForm() {
  destinationTags.value = []
  inputValue.value = ''
  currentDestinationTags.value = []
  currentInputValue.value = ''
  category.value = ''
  value.value = {
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ days: 7 }),
  }
  isEditing.value = false
}

function updateTrip() {
  if (selectedTrip.value && isFormValid.value) {
    const updatedTrip = {
      ...selectedTrip.value,
      name: editTripName.value,
      destination: currentDestinationTags.value,
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

watch(() => selectedTrip.value, (newTrip) => {
  if (newTrip) {
    tripEditDateRange.value = {
      start: newTrip.startDate,
      end: newTrip.endDate
    }
  }
}, { immediate: true })

function closePopover() {
  isDatePopoverOpen.value = false;
}

function saveDateRangeAndClose() {
  if (selectedTrip.value && tripEditDateRange.value.start && tripEditDateRange.value.end) {
    selectedTrip.value.startDate = tripEditDateRange.value.start;
    selectedTrip.value.endDate = tripEditDateRange.value.end;
    
    // Update the trip in the appropriate list
    const lists = [ongoingTrips, upcomingTrips, pastTrips];
    lists.forEach(list => {
      const index = list.value.findIndex(trip => trip.id === selectedTrip.value?.id);
      if (index !== -1) {
        list.value[index] = { ...selectedTrip.value };
      }
    });
    
    saveTripsToLocalStorage();
    
    // Force re-render of the badge
    selectedTrip.value = { ...selectedTrip.value };
  }
  isDatePopoverOpen.value = false;
}

function updateTripEditDateRange(newValue) {
  tripEditDateRange.value = newValue;
}

const currentInputValue = ref('')
const currentDestinationTags = ref<string[]>([])
const editTripName = ref('')
const tripNameInput = ref(null)

function addDestination() {
  if (currentInputValue.value.trim()) {
    currentDestinationTags.value.push(currentInputValue.value.trim())
    currentInputValue.value = ''
  }
}

function removeDestination(place: string) {
  currentDestinationTags.value = currentDestinationTags.value.filter(item => item !== place)
}

const isAccommodationDialogOpen = ref(false)
const accommodationName = ref('')
const accommodationAddress = ref('')
const accommodationDates = ref({ start: null, end: null })
const accommodationType = ref('')

const isAccommodationFormValid = computed(() => 
  accommodationName.value.trim() !== '' &&
  accommodationAddress.value.trim() !== '' &&
  accommodationDates.value.start &&
  accommodationDates.value.end &&
  accommodationType.value !== ''
)

function openAccommodationDialog() {
  isAccommodationDialogOpen.value = true
  // Reset form fields
  accommodationName.value = ''
  accommodationAddress.value = ''
  accommodationDates.value = { start: null, end: null }
  accommodationType.value = ''
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function addAccommodation() {
  if (isAccommodationFormValid.value) {
    // Add logic to save the accommodation
    console.log('Adding accommodation:', {
      name: accommodationName.value,
      address: accommodationAddress.value,
      dates: accommodationDates.value,
      type: accommodationType.value
    })
    // Close the dialog
    isAccommodationDialogOpen.value = false
  }
}

const destinationValue = computed(() => currentDestinationTags.value)

import { addDays, format } from 'date-fns'

const tripDays = computed(() => {
  if (!selectedTrip.value) return []

  const start = selectedTrip.value.startDate.toDate(getLocalTimeZone())
  const end = selectedTrip.value.endDate.toDate(getLocalTimeZone())

  const days = []
  let currentDay = start
  while (currentDay <= end) {
    days.push(new Date(currentDay))
    currentDay = addDays(currentDay, 1)
  }
  return days
})

function formatDayLabel(date: Date, index: number): string {
  const dayNumber = index + 1
  const dayOfWeek = format(date, 'EEEE')
  const formattedDate = format(date, 'MMM d')
  return `Day ${dayNumber}, ${dayOfWeek} – ${formattedDate}`
}

const newPackingItem = ref('')
const packingList = ref([])

function addPackingItem() {
  if (newPackingItem.value.trim()) {
    packingList.value = [...packingList.value, { id: Date.now(), name: newPackingItem.value.trim(), packed: false }]
    newPackingItem.value = ''
  }
}

function removePackingItem(id: number) {
  packingList.value = packingList.value.filter(item => item.id !== id)
}

function togglePackedStatus(id: number) {
  const item = packingList.value.find(item => item.id === id)
  if (item) {
    item.packed = !item.packed
    packingList.value = [...packingList.value]
  }
}

onMounted(() => {
  loadTripsFromLocalStorage()
})

const calendarValue = computed({
  get: () => ({
    start: selectedTrip.value ? selectedTrip.value.startDate : today(getLocalTimeZone()),
    end: selectedTrip.value ? selectedTrip.value.endDate : today(getLocalTimeZone()).add({ days: 7 })
  }),
  set: (newValue) => {
    if (selectedTrip.value) {
      selectedTrip.value.startDate = newValue.start
      selectedTrip.value.endDate = newValue.end
    }
  }
})

function updateTripDates(newValue) {
  if (selectedTrip.value) {
    selectedTrip.value.startDate = newValue.start
    selectedTrip.value.endDate = newValue.end
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

const placeLink = ref('')
const addedPlaces = ref<Array<{id: string, name: string, address: string, showPreview: boolean, phoneNumber: string, rating: number, reviewCount: number, originalUrl: string, isGoogleMapsPlace: boolean}>>([])

const isValidGoogleMapsLink = computed(() => {
  const link = placeLink.value.trim();
  return link.includes('google.com/maps') || 
         link.includes('goo.gl/maps') || 
         link.includes('maps.app.goo.gl') ||
         /^@?https?:\/\/maps\.app\.goo\.gl\/\w+$/.test(link);
})

async function extractPlaceInfo(url: string): Promise<{ name: string, lat: number, lng: number } | null> {
  console.log("Extracting place info from URL:", url);
  
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    const placeIndex = pathSegments.indexOf('place');
    
    if (placeIndex !== -1 && placeIndex < pathSegments.length - 1) {
      const placeName = decodeURIComponent(pathSegments[placeIndex + 1]);
      const coords = urlObj.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      
      if (coords) {
        return {
          name: placeName,
          lat: parseFloat(coords[1]),
          lng: parseFloat(coords[2])
        };
      }
    }
    
    console.error("Could not extract place info from URL");
    return null;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
}

function extractCoordinates(url: string): { lat: string, lng: string } | null {
  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) {
    return { lat: match[1], lng: match[2] };
  }
  return null;
}

async function getPlacePreviewUrl(place: { name: string, id: string }): Promise<string> {
  try {
    const params = new URLSearchParams(place.id ? { id: place.id } : { name: place.name })
    console.log('Fetching URL:', `/api/googlemaps/googlemaps?${params}`)
    const response = await fetch(`/api/googlemaps/googlemaps?${params}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch place preview URL: ${response.status} ${response.statusText}`)
    }
    const url = await response.text()
    console.log('Received URL:', url)
    return url
  } catch (error) {
    console.error('Error fetching place preview URL:', error)
    return ''
  }
}

async function addPlace() {
  console.log("addPlace function called with:", placeLink.value);
  const placeInfo = await extractPlaceInfo(placeLink.value);
  const originalUrl = placeLink.value;
  
  if (placeInfo) {
    try {
      console.log("Loading Google Maps API...");
      const google = await loader.load();
      console.log("Google Maps API loaded successfully");
      
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      console.log("PlacesService created");
      
      const request = {
        query: placeInfo.name,
        location: new google.maps.LatLng(placeInfo.lat, placeInfo.lng),
        radius: 100, // Search within 100 meters of the given coordinates
        fields: ['name', 'formatted_address', 'place_id', 'geometry', 'rating', 'user_ratings_total', 'photos', 'formatted_phone_number']
      };
      
      service.textSearch(request, (results, status) => {
        console.log("Text search completed. Status:", status);
        console.log("Results:", results);
        
        if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
          handlePlaceResult(results[0], originalUrl);
        } else {
          console.error("Place search failed. Status:", status);
          alert("Failed to find the place. Please try a different link.");
        }
      });
    } catch (error) {
      console.error("Error in addPlace function:", error);
      alert("An error occurred while adding the place. Please try again.");
    }
  } else {
    console.error("No valid place info extracted");
    alert("Could not extract place information from the provided link. Please try a different Google Maps link.");
  }
}

function handlePlaceResult(place, originalUrl: string) {
  console.log("Place found:", place);
  addedPlaces.value.push({
    id: place.place_id,
    name: place.name,
    address: place.formatted_address,
    phoneNumber: place.formatted_phone_number || 'Not available',
    rating: place.rating || 'Not rated',
    reviewCount: place.user_ratings_total || 0,
    showPreview: false,
    originalUrl: originalUrl,
    isGoogleMapsPlace: true
  });
  console.log("Place added to list:", addedPlaces.value);
  placeLink.value = '';
}

async function toggleMapPreview(place) {
  place.showPreview = !place.showPreview
  if (place.showPreview && !place.previewUrl) {
    place.previewUrl = await getPlacePreviewUrl(place)
  }
}

function deletePlace(placeToDelete) {
  addedPlaces.value = addedPlaces.value.filter(place => place.id !== placeToDelete.id)
}

const isSidebarCollapsed = ref(false)

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// Add these imports if not already present
import { ref, computed } from 'vue'

// Add these to your component's setup function or script setup
const planTitle = ref('')
const planAddress = ref('')
const planComments = ref('')

const isManualPlanValid = computed(() => planTitle.value.trim() !== '')

function addManualPlan() {
  if (isManualPlanValid.value) {
    addedPlaces.value.push({
      id: Date.now().toString(), // Generate a unique ID
      name: planTitle.value,
      address: planAddress.value || 'No address provided',
      phoneNumber: 'Not available',
      rating: 'Not rated',
      reviewCount: 0,
      showPreview: false,
      originalUrl: '',
      comments: planComments.value || '',
      isGoogleMapsPlace: false
    })

    // Reset the form
    planTitle.value = ''
    planAddress.value = ''
    planComments.value = ''
  }
}

const dayPlans = ref<{ [key: number]: Array<any> }>({})

const unassignedPlaces = computed(() => {
  const assignedPlaceIds = Object.values(dayPlans.value).flat().map(place => place.id)
  return addedPlaces.value.filter(place => !assignedPlaceIds.includes(place.id))
})

function assignPlaceToDay(place, dayIndex) {
  if (!dayPlans.value[dayIndex]) {
    dayPlans.value[dayIndex] = []
  }
  dayPlans.value[dayIndex].push(place)
  // If this is the first plan for the day, expand it automatically
  if (dayPlans.value[dayIndex].length === 1) {
    expandedDays.value[dayIndex] = true
  }
  // Force Vue to detect the change
  dayPlans.value = { ...dayPlans.value }
}

function getDayPlans(dayIndex: number) {
  return dayPlans.value[dayIndex] || []
}

function unassignPlace(place, dayIndex) {
  dayPlans.value[dayIndex] = dayPlans.value[dayIndex].filter(p => p.id !== place.id)
  // Force Vue to detect the change
  dayPlans.value = { ...dayPlans.value }
}

function reassignPlace(place, fromDayIndex, toDayIndex) {
  // Remove from current day
  dayPlans.value[fromDayIndex] = dayPlans.value[fromDayIndex].filter(p => p.id !== place.id)
  
  // Add to new day
  if (!dayPlans.value[toDayIndex]) {
    dayPlans.value[toDayIndex] = []
  }
  dayPlans.value[toDayIndex].push(place)
  
  // Force Vue to detect the change
  dayPlans.value = { ...dayPlans.value }
}

const expandedDays = ref({})

function toggleDayPlans(index: number) {
  if (getDayPlans(index).length > 0) {
    expandedDays.value[index] = !expandedDays.value[index]
  }
}

// Watch for changes in dayPlans
watch(() => dayPlans.value, (newDayPlans, oldDayPlans) => {
  Object.keys(newDayPlans).forEach((dayIndex) => {
    const newPlansCount = newDayPlans[dayIndex].length
    const oldPlansCount = oldDayPlans?.[dayIndex]?.length || 0

    // If a new plan was added and it's the first plan for that day, expand it
    if (newPlansCount === 1 && oldPlansCount === 0) {
      expandedDays.value[dayIndex] = true
    }
  })
}, { deep: true })

</script>

<style scoped>
/* You can add any additional styles here if needed */
</style>