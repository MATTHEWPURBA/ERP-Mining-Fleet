<template>
    <div>
      <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
        <span v-if="required" class="text-red-600">*</span>
      </label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="material-icons text-gray-400">{{ type === 'date' ? 'event' : 'schedule' }}</span>
        </div>
        
        <input
          :id="id"
          :type="type"
          :value="modelValue"
          @input="updateValue($event)"
          :min="min"
          :max="max"
          :required="required"
          :disabled="disabled"
          :readonly="readonly"
          :class="[
            'block w-full pl-10 rounded-md sm:text-sm',
            error ? 
              'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:bg-red-900/10 dark:text-red-400' : 
              'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white',
            disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-800' : ''
          ]"
        />
      </div>
      
      <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-500">{{ error }}</p>
      <p v-else-if="hint" class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ hint }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FormDatetime',
    props: {
      modelValue: {
        type: String,
        default: ''
      },
      id: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'datetime-local',
        validator: (value) => ['date', 'time', 'datetime-local'].includes(value)
      },
      min: {
        type: String,
        default: null
      },
      max: {
        type: String,
        default: null
      },
      required: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      error: {
        type: String,
        default: ''
      },
      hint: {
        type: String,
        default: ''
      }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const updateValue = (event) => {
        emit('update:modelValue', event.target.value);
      };
      
      return {
        updateValue
      };
    }
  };
  </script>