<template>
  <div class="bg-white w-screen min-h-screen flex flex-col items-center py-8">
    <div class="max-w-[415px] w-full flex flex-col items-center gap-10">
      <img
        class="w-48 h-48 rounded-xl"
        src="/assets/portrait2.png"
        alt="Portrait of Daniel"
      />
      
      <div class="text-center flex flex-col gap-4 text-neutral-600 text-xl">
        <h1>Hey there, I'm Daniel 👋</h1>
        <p>
          I'm a product designer based in Washington, DC, currently working for 
          <a href="https://www.gabrielvaldivia.com/" class="font-semibold text-black hover:underline hover:text-[#ff4f1f]">Valdivia Works</a>, 
          helping founders craft 0→1 products.
        </p>
        <p>
          By night, I'm building 
          <a href="https://heywaffle.app/" class="font-semibold text-black hover:underline hover:text-[#ff4f1f]">Waffle</a>, 
          a visual organization app – a digital homepage with fun and dynamic widgets.
        </p>
        <p>
          On the side, I'm a <a href="https://www.instagram.com/soydanielchung/" class="font-semibold text-black hover:underline hover:text-[#ff4f1f]">tech content creator</a> in Spanish, 
          covering exciting software and consumer technology.
        </p>
        <p>
          I help bring ideas to life and solve challenging problems with clever design.
        </p>
      </div>
      <nav class="max-w-[400px]">
        <ul class="flex justify-between bg-white shadow-md rounded-xl px-1 py-1 border relative">
          <li v-for="(tab, index) in tabs" :key="tab" 
              @click="selectTab(tab, index)"
              @mouseenter="hoverIndex = index"
              @mouseleave="hoverIndex = null"
              class="cursor-pointer px-3 py-1 rounded-lg z-10 relative"
              :class="[
                selectedTab === tab 
                  ? 'text-neutral-800' 
                  : 'text-neutral-400 hover:text-neutral-800'
              ]"
              :ref="el => { if (el) tabRefs[index] = el }">
            {{ tab }}
          </li>
          <div 
            class="absolute top-1 bottom-1 bg-neutral-100 rounded-lg transition-all duration-200 ease-in-out"
            :style="sliderStyle"
          ></div>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const tabs = ['Daniel', 'Projects', 'Things', 'Moments']
const selectedTab = ref('Daniel')
const hoverIndex = ref(null)
const tabRefs = ref([])

const sliderStyle = computed(() => {
  if (tabRefs.value.length === 0) return {}
  const index = hoverIndex.value !== null ? hoverIndex.value : tabs.indexOf(selectedTab.value)
  const currentTab = tabRefs.value[index]
  return {
    left: `${currentTab.offsetLeft}px`,
    width: `${currentTab.offsetWidth}px`
  }
})

const selectTab = (tab, index) => {
  selectedTab.value = tab
  hoverIndex.value = null
}

onMounted(() => {
  // Force initial calculation of slider position
  tabRefs.value = [...tabRefs.value]
})
</script>