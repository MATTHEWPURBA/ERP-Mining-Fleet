<template>
  <div class="bg-white dark:bg-gray-800 shadow">
    <div class="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div class="w-full text-left">
          <!-- Explicitly set text-left and full width -->
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ subtitle }}
          </p>
        </div>

        <div v-if="$slots.actions" class="flex-shrink-0 ml-4">
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
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped>
/* Additional scoped styles to ensure left alignment */
h1,
p {
  text-align: left;
}
</style>
<!-- src/components/common/PageHeader.vue (Updated) -->