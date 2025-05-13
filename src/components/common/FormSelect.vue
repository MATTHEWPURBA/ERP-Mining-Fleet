<template>
    <div>
      <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
        <span v-if="required" class="text-red-600">*</span>
      </label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <select
          :id="id"
          :value="modelValue"
          @change="updateValue($event)"
          :required="required"
          :disabled="disabled"
          :multiple="multiple"
          :size="size"
          :class="[
            'block w-full rounded-md sm:text-sm appearance-none',
            error ? 
              'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:bg-red-900/10 dark:text-red-400' : 
              'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white',
            disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-800' : ''
          ]"
        >
          <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
          <option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled">
            {{ option.text }}
          </option>
        </select>
        
        <!-- Dropdown arrow -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <span class="material-icons text-gray-400">expand_more</span>
        </div>
      </div>
      
      <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-500">{{ error }}</p>
      <p v-else-if="hint" class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ hint }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FormSelect',
    props: {
      modelValue: {
        type: [String, Number, Array],
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
      options: {
        type: Array,
        required: true
      },
      placeholder: {
        type: String,
        default: 'Select an option'
      },
      required: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: false
      },
      size: {
        type: Number,
        default: null
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
        let value = event.target.value;
        
        // Handle multiple select
        if (props.multiple) {
          value = Array.from(event.target.selectedOptions).map(option => option.value);
        }
        
        emit('update:modelValue', value);
      };
      
      return {
        updateValue
      };
    }
  };
  </script>