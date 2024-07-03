<template>
  <div class="bg-neutral-200 w-screen h-screen grid place-content-center">
    <!-- Top Navigation Bar -->
    <nav class="bg-white w-full p-2 shadow-md rounded-2xl">
      <ul class="flex justify-around">
        <li class="cursor-pointer px-3 py-1 rounded-lg bg-neutral-100 text-neutral-800 font-semibold hover:text-neutral-900">Daniel</li>
        <li class="cursor-pointer px-3 py-1 rounded-lg text-neutral-400 hover:text-neutral-600">Projects</li>
        <li class="cursor-pointer px-3 py-1 rounded-lg text-neutral-400 hover:text-neutral-600">Things</li>
        <li class="cursor-pointer px-3 py-1 rounded-lg text-neutral-400 hover:text-neutral-600">Moments</li>
      </ul>
    </nav>
    <!-- Existing Content -->
    <div class="grid gap-1 mt-4">
      <div class="bg-white p-4 rounded-2xl w-[400px]">
        <img
          class="fit-picture rounded-2xl w-[150px] mb-1"
          src="/assets/portrait.jpeg"
          alt="A portrait of Daniel Chung" />
        <p class="pt-3">Hi there! I'm a product designer based in Washington, DC. I'm currently building Waffle, a visual organization app, and working on new digital products alongside Valdivia Works.</p>
      </div>
      <div class="bg-white text-neutral-500 p-4 rounded-2xl w-[400px]">
        <p>insert product logos here</p>
      </div>
      <div class="bg-white text-neutral-500 p-4 rounded-2xl w-[400px]">
        <p>@soydanielchung</p>
        <p>danielchungfung@gmail.com</p>
      </div>
    </div>
  </div>
</template>
