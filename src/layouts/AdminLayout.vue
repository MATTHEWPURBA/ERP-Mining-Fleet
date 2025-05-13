<template>
    <div class="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <!-- Sidebar component -->
      <Sidebar v-model="sidebarOpen" @toggle="toggleSidebar" />
      
      <!-- Main content area -->
      <div class="flex flex-col flex-1 w-0 overflow-hidden">
        <!-- Top navigation -->
        <Navbar />
        
        <!-- Alert messages -->
        <div v-if="errorMessage || successMessage" class="px-4 py-2">
          <div 
            v-if="errorMessage" 
            class="p-4 mb-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <span class="material-icons text-red-600 dark:text-red-400">error</span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800 dark:text-red-200">{{ errorMessage }}</p>
              </div>
              <div class="ml-auto pl-3">
                <div class="-mx-1.5 -my-1.5">
                  <button 
                    @click="clearError" 
                    class="inline-flex bg-red-50 dark:bg-transparent rounded-md p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"
                  >
                    <span class="sr-only">Dismiss</span>
                    <span class="material-icons">close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div 
            v-if="successMessage" 
            class="p-4 mb-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <span class="material-icons text-green-600 dark:text-green-400">check_circle</span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800 dark:text-green-200">{{ successMessage }}</p>
              </div>
              <div class="ml-auto pl-3">
                <div class="-mx-1.5 -my-1.5">
                  <button 
                    @click="clearSuccessMessage" 
                    class="inline-flex bg-green-50 dark:bg-transparent rounded-md p-1.5 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50"
                  >
                    <span class="sr-only">Dismiss</span>
                    <span class="material-icons">close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Page content -->
        <main class="flex-1 relative overflow-y-auto focus:outline-none">
          <div class="py-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <!-- Content goes here -->
              <slot></slot>
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useStore } from 'vuex';
  import Sidebar from '@/components/common/Sidebar.vue';
  import Navbar from '@/components/common/Navbar.vue';
  
  export default {
    name: 'AdminLayout',
    components: {
      Sidebar,
      Navbar
    },
    setup() {
      const store = useStore();
      const sidebarOpen = ref(true);
      
      // Get global alert messages
      const errorMessage = computed(() => store.getters.getError);
      const successMessage = computed(() => store.getters.getSuccessMessage);
      
      // Methods
      const toggleSidebar = (isOpen) => {
        sidebarOpen.value = isOpen !== undefined ? isOpen : !sidebarOpen.value;
      };
      
      const clearError = () => {
        store.dispatch('clearError');
      };
      
      const clearSuccessMessage = () => {
        store.dispatch('clearSuccessMessage');
      };
      
      // Handle responsive sidebar behavior
      const handleResize = () => {
        if (window.innerWidth < 768) {
          sidebarOpen.value = false;
        } else {
          sidebarOpen.value = true;
        }
      };
      
      // Lifecycle hooks
      onMounted(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
      });
      
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
      });
      
      return {
        sidebarOpen,
        errorMessage,
        successMessage,
        toggleSidebar,
        clearError,
        clearSuccessMessage
      };
    }
  };
  </script>