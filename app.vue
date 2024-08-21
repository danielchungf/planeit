<template>
  <div class="font-sans bg-background min-h-screen">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
</script>
