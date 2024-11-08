<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <header>
      <Navbar />
  </header>
  <main class="flex flex-col w-full items-center bg-night-gray">
    <RouterView />
  </main>
  <footer>
    <Footer />
  </footer>
</template>