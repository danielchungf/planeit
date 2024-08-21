<template>
  <div class="flex flex-col justify-center items-center h-screen gap-5">
    <div class="bg-white p-6 rounded-lg border">
      <div class="mb-4">
        <label for="tripName" class="block text-sm font-medium text-gray-700 mb-1">Name of the trip</label>
        <input type="text" id="tripName" class= "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179BAE]">
      </div>
      <div class="flex space-x-4">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Start date</label>
          <input type="date" id="startDate" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179BAE]">
        </div>
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">End date</label>
          <input type="date" id="endDate" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179BAE]">
        </div>
      </div>
    </div>
    <button class="bg-[#FF8343] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#E67339] transition-colors duration-300 mb-8">
        Create a trip
      </button>
  </div>
</template>