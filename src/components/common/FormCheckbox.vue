<template>
    <div class="relative flex items-start">
      <div class="flex items-center h-5">
        <input
          :id="id"
          type="checkbox"
          :checked="modelValue"
          @change="updateValue($event)"
          :disabled="disabled"
          :class="[
            'h-4 w-4 rounded',
            error ? 
              'border-red-300 text-red-600 focus:ring-red-500 dark:border-red-500' : 
              'border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600',
            disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-800' : ''
          ]"
        />
      </div>
      <div class="ml-3 text-sm">
        <label :for="id" :class="[
          'font-medium',
          disabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'
        ]">
          {{ label }}
        </label>
        <p v-if="description" class="text-gray-500 dark:text-gray-400">{{ description }}</p>
        <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-500">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FormCheckbox',
    props: {
      modelValue: {
        type: Boolean,
        default: false
      },
      id: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      error: {
        type: String,
        default: ''
      }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const updateValue = (event) => {
        emit('update:modelValue', event.target.checked);
      };
      
      return {
        updateValue
      };
    }
  };
  </script>