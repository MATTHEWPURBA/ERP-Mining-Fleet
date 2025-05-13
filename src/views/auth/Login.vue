<template>
    <div>
      <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8">Sign in to your account</h2>
      
      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <div class="mt-1">
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div class="mt-1">
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Enter your password"
            />
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              v-model="rememberMe"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Remember me
            </label>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
      
      <!-- Test credentials section -->
      <div class="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Test Credentials</h3>
        <div class="space-y-2 text-xs text-gray-500 dark:text-gray-400">
          <div class="flex justify-between">
            <span>Administrator:</span>
            <div>
              <div>admin@miningfleet.com</div>
              <div>admin123</div>
            </div>
            <button 
              @click="fillCredentials('admin@miningfleet.com', 'admin123')" 
              class="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Use
            </button>
          </div>
          <div class="flex justify-between">
            <span>Approver:</span>
            <div>
              <div>approver@miningfleet.com</div>
              <div>approver123</div>
            </div>
            <button 
              @click="fillCredentials('approver@miningfleet.com', 'approver123')" 
              class="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Use
            </button>
          </div>
          <div class="flex justify-between">
            <span>Regular User:</span>
            <div>
              <div>user@miningfleet.com</div>
              <div>user123</div>
            </div>
            <button 
              @click="fillCredentials('user@miningfleet.com', 'user123')" 
              class="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Use
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Login',
    setup() {
      const store = useStore();
      const router = useRouter();
      
      // Form data
      const email = ref('');
      const password = ref('');
      const rememberMe = ref(false);
      
      // Computed properties
      const loading = computed(() => store.state.auth.status === 'loading');
      
      // Methods
      const login = async () => {
        try {
          await store.dispatch('auth/login', {
            email: email.value,
            password: password.value
          });
          
          // Redirect to dashboard after successful login
          router.push({ name: 'dashboard' });
        } catch (error) {
          console.error('Login error:', error);
        }
      };
      
      const fillCredentials = (testEmail, testPassword) => {
        email.value = testEmail;
        password.value = testPassword;
      };
      
      return {
        email,
        password,
        rememberMe,
        loading,
        login,
        fillCredentials
      };
    }
  };
  </script>