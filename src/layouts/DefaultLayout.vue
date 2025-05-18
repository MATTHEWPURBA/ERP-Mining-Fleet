<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Include the universal navbar at the top of the layout -->
    <UniversalNavbar />
    
    <!-- Main content container with proper spacing to account for the navbar -->
    <main class="pt-6"> <!-- Add padding-top to account for fixed navbar height -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Pass through the child component content via Vue's slot system -->
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script>
import UniversalNavbar from '@/components/common/UniversalNavbar.vue';

export default {
  name: 'DefaultLayout',
  components: {
    UniversalNavbar
  }
}
</script>

<style scoped>
/* Scoped styles ensure they only apply to this component */
main {
  min-height: calc(100vh - 4rem); /* Account for navbar height */
}
</style>

<!-- frontend/src/layouts/DefaultLayout.vue -->