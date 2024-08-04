<template>
  <div class="min-h-screen bg-white">
    <header class="sticky top-0 z-10 flex justify-between items-center px-5 py-4 border-b bg-white">
      <div class="text-xl font-bold font-cabinet">
        <NuxtLink to="/">DANIEL CHUNG</NuxtLink>
      </div>
      <nav>
        <ul class="flex space-x-5 text-xl font-cabinet font-bold">
          <li><NuxtLink class="hover:text-[#FF621F]" to="/work">WORK</NuxtLink></li>
          <li><NuxtLink class="hover:text-[#FF621F]" to="/about">ABOUT</NuxtLink></li>
          <li><a class="hover:text-[#FF621F]" href="mailto:danielchungfung@gmail.com">EMAIL</a></li>
        </ul>
      </nav>
    </header>

    <main class="mx-5 my-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <h1 class="font-editorial font-ultralight text-3xl text-neutral-700 md:text-4xl lg:text-5xl">
          Exceptional design for modern products and videogames.
        </h1>
        <h2 class="font-editorial font-ultralight text-3xl text-neutral-400 md:text-4xl lg:text-5xl">
          I bring impactful <span class="italic">ideas to live</span> with clever, thoughtful and adaptable craft.
        </h2>
      </div>

      <section id="work" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PortfolioItem
          v-for="item in portfolioItems"
          :key="item.id"
          :title="item.title"
          :category="item.category"
          :description="item.description"
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
    category: 'Product design',
    description: 'An AI content platform for organizations. All your databases connected in one place.'
  },
  {
    id: 2,
    title: 'Workmate',
    category: 'Product design',
    description: 'An AI content platform for organizations. All your databases connected in one place.'
  },
  {
    id: 3,
    title: 'Ritual Dental',
    category: 'Product design',
    description: 'An AI content platform for organizations. All your databases connected in one place.'
  },
  {
    id: 4,
    title: 'Waffle',
    category: 'Product design',
    description: 'An AI content platform for organizations. All your databases connected in one place.'
  },
  {
    id: 5,
    title: 'Loop',
    category: 'Product design',
    description: 'An AI content platform for organizations. All your databases connected in one place.'
  },
  {
    id: 6,
    title: 'Egg Custard',
    category: 'Product design',
    description: 'An AI content platform for organizations. All your databases connected in one place.'
  },
  {
    id: 7,
    title: 'Almanac',
    category: 'Product design',
    description: 'An AI content platform for organizations. All your databases connected in one place.'
  }
]
</script>