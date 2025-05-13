<template>
    <form @submit.prevent="onSubmit" class="space-y-6">
      <slot></slot>
      
      <!-- Form buttons -->
      <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          v-if="showCancel"
          type="button"
          @click="onCancel"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ cancelText }}
        </button>
        <button
          type="submit"
          :disabled="loading || disabled"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loadingText }}
          </span>
          <span v-else>{{ submitText }}</span>
        </button>
      </div>
    </form>
  </template>
  
  <script>
  export default {
    name: 'BaseForm',
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      submitText: {
        type: String,
        default: 'Submit'
      },
      loadingText: {
        type: String,
        default: 'Submitting...'
      },
      showCancel: {
        type: Boolean,
        default: true
      },
      cancelText: {
        type: String,
        default: 'Cancel'
      }
    },
    emits: ['submit', 'cancel'],
    setup(props, { emit }) {
      const onSubmit = () => {
        emit('submit');
      };
      
      const onCancel = () => {
        emit('cancel');
      };
      
      return {
        onSubmit,
        onCancel
      };
    }
  };
  </script>