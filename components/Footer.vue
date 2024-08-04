<template>
  <footer class="border-t px-5 py-4">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div class="mb-6 md:mb-0 flex flex-col md:flex-row">
        <div class="mr-20 flex flex-col">
          <p class="font-bold font-cabinet mb-[5px]">CONTACT</p>
          <a href="mailto:danielchungfung@gmail.com" class="block text-neutral-500 hover:text-neutral-900 mb-2 font-cabinet">danielchungfung@gmail.com</a>
        </div>
        <div class="flex flex-col">
          <a href="https://x.com/itsdanielchung" target="_blank" rel="noopener noreferrer" class="block text-neutral-500 hover:text-neutral-900 mb-[5px] font-cabinet">x.com</a>
          <a href="https://instagram.com/soydanielchung" target="_blank" rel="noopener noreferrer" class="block text-neutral-500 hover:text-neutral-900 font-cabinet">instagram</a>
        </div>
      </div>
      <div>
        <a href="mailto:danielchungfung@gmail.com" class="text-4xl text-[#FF621F] hover:text-[#FF621F]/90 font-editorial font-ultralight thin-underline">
          Send me an email
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.thin-underline {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  transition: text-decoration-thickness 0.3s ease;
}

.thin-underline:hover {
  text-decoration-thickness: 2px;
}
</style>