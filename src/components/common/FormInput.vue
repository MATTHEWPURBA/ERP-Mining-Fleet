<template>
    <div>
      <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
        <span v-if="required" class="text-red-600">*</span>
      </label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <div 
          v-if="$slots.prefix || prefixIcon" 
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <span v-if="prefixIcon" class="material-icons text-gray-400">{{ prefixIcon }}</span>
          <slot v-else name="prefix"></slot>
        </div>
        
        <input
          :id="id"
          :type="type"
          :value="modelValue"
          @input="updateValue($event)"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          :readonly="readonly"
          :min="min"
          :max="max"
          :step="step"
          :class="[
            'block w-full rounded-md sm:text-sm',
            $slots.prefix || prefixIcon ? 'pl-10' : '',
            $slots.suffix || suffixIcon ? 'pr-10' : '',
            error ? 
              'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:bg-red-900/10 dark:text-red-400' : 
              'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white',
            disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-800' : ''
          ]"
        />
        
        <div 
          v-if="$slots.suffix || suffixIcon" 
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <span v-if="suffixIcon" class="material-icons text-gray-400">{{ suffixIcon }}</span>
          <slot v-else name="suffix"></slot>
        </div>
      </div>
      
      <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-500">{{ error }}</p>
      <p v-else-if="hint" class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ hint }}</p>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  
  export default {
    name: 'FormInput',
    props: {
      modelValue: {
        type: [String, Number],
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
        default: 'text'
      },
      placeholder: {
        type: String,
        default: ''
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
      min: {
        type: [String, Number],
        default: null
      },
      max: {
        type: [String, Number],
        default: null
      },
      step: {
        type: [String, Number],
        default: null
      },
      error: {
        type: String,
        default: ''
      },
      hint: {
        type: String,
        default: ''
      },
      prefixIcon: {
        type: String,
        default: ''
      },
      suffixIcon: {
        type: String,
        default: ''
      }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const updateValue = (event) => {
        let value = event.target.value;
        
        // Convert to number for number inputs
        if (props.type === 'number' && value !== '') {
          value = parseFloat(value);
        }
        
        emit('update:modelValue', value);
      };
      const inputClasses = computed(() => {
      return {
        'border-red-500': props.error,
        'border-gray-300': !props.error,
        'bg-gray-100': props.disabled
      };
    });

      
      return {
        updateValue,
        inputClasses
      };
    }
  };
  </script>