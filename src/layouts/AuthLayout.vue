<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <div class="flex items-center">
          <span class="material-icons text-blue-600 dark:text-blue-400 text-3xl mr-2">local_shipping</span>
          <h1 class="text-3xl font-bold text-blue-600 dark:text-blue-400">Mining Fleet Management</h1>
        </div>
      </div>

      <!-- Alert messages -->
      <div v-if="errorMessage" class="mb-6">
        <div class="p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div class="flex">
            <div class="flex-shrink-0">
              <span class="material-icons text-red-600 dark:text-red-400">error</span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800 dark:text-red-200">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10">
        <slot></slot>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2025 Mining Fleet Management. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AuthLayout',
  setup() {
    const store = useStore();

    // Get global error message
    const errorMessage = computed(() => store.getters.getError);

    return {
      errorMessage,
    };
  },
};
</script>

<!-- Note: We don't include the navbar in the auth layout since users aren't logged in yet -->
<!-- frontend/src/layouts/AuthLayout.vue (Updated, but without navbar since users aren't authenticated) -->
