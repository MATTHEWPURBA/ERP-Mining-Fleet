<template>
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ title }}
            </h1>
            <p v-if="subtitle" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ subtitle }}
            </p>
          </div>
          
          <div v-if="$slots.actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PageHeader',
    props: {
      title: {
        type: String,
        required: true
      },
      subtitle: {
        type: String,
        default: ''
      }
    }
  };
  </script>