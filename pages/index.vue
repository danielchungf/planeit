<template>
  <div class="bg-white w-screen min-h-screen flex flex-col items-center py-8">
    <div class="max-w-[415px] w-full flex flex-col items-center gap-10 mb-14">
      <img
        class="w-48 h-48 rounded-xl"
        src="/assets/portrait2.png"
        alt="Portrait of Daniel"
      />
      
      <div class="text-center flex flex-col gap-4 text-neutral-700 text-xl">
        <h1>Hey there, I'm Daniel 👋</h1>
        <p>
          I'm a product designer based in Washington, DC, currently working for 
          <a href="https://www.gabrielvaldivia.com/" class="font-semibold text-black hover:underline hover:text-[#ff4f1f]">Valdivia Works</a>, 
          helping founders craft 0→1 products.
        </p>
        <p>
          By night, I'm building 
          <a href="https://heywaffle.app/" class="font-semibold text-black hover:underline hover:text-[#ff4f1f]">Waffle</a>, 
          a visual organization app – a digital homepage with fun and dynamic widgets. And I'm also collaborating on a secret fantasy RPG, working on the overall design, mechanics, and UI.

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
      <div v-if="selectedTab === 'Hobbies'" class="text-center flex flex-col gap-4 text-neutral-600 text-xl mt-4 h-[150px]">
        <div class="flex justify-center">
          <span v-for="(hobby, index) in hobbies" :key="hobby.name" @mouseenter="hoverHobby = index" @mouseleave="hoverHobby = defaultHobbyIndex" @click="hoverHobby = index" class="cursor-pointer text-3xl px-3 py-2 rounded-xl hover:bg-neutral-100">
            {{ hobby.emoji }}
          </span>
        </div>
        <div class="min-h-[100px]">
          <p>{{ hobbies[hoverHobby].description }}</p>
        </div>
      </div>
      <div v-else class="text-center text-neutral-600 text-xl mt-4 h-[150px]">
        <p>Work in progress – Nothing to show yet 😅</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const tabs = ['Hobbies', 'Projects', 'Things', 'Moments']
const selectedTab = ref('Hobbies')
const hoverIndex = ref(null)
const tabRefs = ref([])

const hobbies = [
  { name: 'Hiking', emoji: '🌳', description: 'A designer that hikes? I always overpack when immersing myself in the woods. My latest trips were to Zion, Sedona, Shenandoah, Sequoia NP and Yosemite.' },
  { name: 'Biking', emoji: '🚴🏼‍♂️', description: 'There is nothing like a morning bike ride at Rock Creek Park to inhale fresh air, hear the birds chirping, and listen to the monkeys chatter (there is a zoo nearby).' },
  { name: 'Boardgames', emoji: '♟️', description: 'The collectionist in me feels the urge to buy new board games even when I haven\'t played several that I already own. Currently, I\'m enjoying Terraforming Mars with my friends.' },
  { name: 'Watercoloring', emoji: '🎨', description: 'I just got into watercoloring. I bought my Winsor & Newton starter kit, and I don\'t know why I often find myself painting nigiris as my first motif.' },
  { name: 'Coffee', emoji: '☕️', description: 'This summer was the perfect excuse I needed to perfect my iced coffee latte recipe. I brew coffee the night before and then refrigerate it for the morning.' },
  { name: 'Cooking', emoji: '🥘', description: 'I love learning and cooking new recipes. I\'m specially interested in korean, japanese, and brazilian cuisines. My current favorite dish is probably Katsu Curry.' },
  { name: 'Videogames', emoji: '🧙🏻‍♂️', description: 'I have played videogames since I was a little kid. Right now, I\'m playing Overwatch and Final Fantasy XIV with my wife and highschool friends.' }
]

const defaultHobbyIndex = 0
const hoverHobby = ref(defaultHobbyIndex)

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