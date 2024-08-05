<template>
  <div class="min-h-screen bg-white">
    <header class="sticky top-0 z-10 flex justify-between items-center px-5 py-4 border-b bg-white">
      <div class="text-xl font-bold font-cabinet">
        <NuxtLink to="/">DANIEL CHUNG</NuxtLink>
      </div>
      <nav>
        <ul class="flex space-x-5 text-xl font-cabinet font-bold">
          <!-- <li><NuxtLink class="hover:text-[#FF621F]" to="/work">WORK</NuxtLink></li>
          <li><NuxtLink class="hover:text-[#FF621F]" to="/about">ABOUT</NuxtLink></li> -->
          <li><a class="hover:text-[#FF621F]" href="mailto:danielchungfung@gmail.com">EMAIL</a></li>
        </ul>
      </nav>
    </header>

    <main class="mx-5 my-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <h1 class="font-editorial font-ultralight text-3xl text-neutral-700 md:text-4xl lg:text-5xl">
          Exceptional design for modern products.
        </h1>
        <h2 class="font-editorial font-ultralight text-3xl text-neutral-400 md:text-4xl lg:text-5xl">
          I bring impactful <span class="italic color-animation">ideas to life</span> with clever, thoughtful and adaptable craft.
        </h2>
      </div>

      <section id="work" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PortfolioItem
          v-for="item in portfolioItems"
          :key="item.id"
          :title="item.title"
          :category="item.category"
          :description="item.description"
          :image="item.image"
          :link="item.link"
        />
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import PortfolioItem from '~/components/PortfolioItem.vue'
import Footer from '~/components/Footer.vue'
import { useHead } from '#imports'

useHead({
  title: 'Daniel Chung',
  // Add other meta tags as needed
})

const portfolioItems = [
  {
    id: 1,
    title: 'Supper',
    image: "/supper.jpg",
    category: 'Product design',
    description: 'An AI content platform for enterprises. All your databases connected in one place.',
  },
  {
    id: 2,
    title: 'Workmate',
    image: "/workmate.jpg",
    category: 'Product design',
    description: 'An AI teammate who helps you fly through your emails and reclaim headspace.',
    link: 'https://www.workmate.com/'
  },
  {
    id: 3,
    title: 'Ritual Dental',
    image: "/ritualdental.jpg",
    category: 'Product design',
    description: 'A dental clinic that combines tech and science with a comprehensive health perspective.',
    link: 'https://www.ritualdental.com/'
  },
  {
    id: 4,
    title: 'Waffle',
    image: "/waffle.jpg",
    category: 'Founding designer',
    description: 'A digital homepage for all your essentials. A visual organization board for your life.',
    link: 'https://heywaffle.app'
  },
  // {
  //   id: 5,
  //   title: 'Loop',
  //   category: 'Product design',
  //   description: 'An AI content platform for organizations. All your databases connected in one place.'
  // },
  {
    id: 6,
    title: 'Secret Game',
    image: "/eggcustard.jpg",
    category: 'Game & UI design',
    description: 'An RPG about an alchemist whose goal is to bridge the gap between people and nature.',
  },
  {
    id: 7,
    title: 'Almanac',
    image: "/almanac.jpg",
    category: 'Icon design',
    description: 'A simple iOS app to keep track of the events you look forward to.',
    link: 'https://apps.apple.com/us/app/almanac-events-countdown/id6504696550'
  }
]
</script>

<style scoped>
h1 {
  line-height: 1.2; /* Adjust as needed */
}

h2 {
  line-height: 1.2; /* Adjust as needed */
}

.color-animation {
  color: inherit; /* Inherit the current text color */
  transition: color 0.3s ease; /* Add transition for color change */
}

.color-animation:hover {
  color: #FF621F; /* Change text color on hover */
}
</style>