<template>
    <div>
      <PageHeader 
        title="Edit Booking" 
        :subtitle="booking ? `Booking #${booking.id}` : 'Loading...'"
      />
      
      <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <!-- Loading state -->
        <div v-if="loading && !booking" class="animate-pulse space-y-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        
        <!-- Edit form when data is loaded -->
        <BaseForm 
          v-else-if="booking"
          :loading="submitting" 
          :submit-text="'Update Booking'" 
          @submit="submitForm" 
          @cancel="$router.push(`/bookings/${booking.id}`)"
        >
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Vehicle Selection -->
            <FormSelect 
              id="vehicle_id"
              label="Vehicle"
              v-model="form.vehicle_id"
              :options="availableVehicles"
              :error="errors.vehicle_id"
              :hint="availableVehicles.length ? 'Select a vehicle from the list' : 'No vehicles available for the selected date range'"
              required
            />
            
            <!-- Purpose -->
            <FormInput 
              id="purpose"
              label="Purpose"
              v-model="form.purpose"
              placeholder="Enter booking purpose"
              :error="errors.purpose"
              required
            />
            
            <!-- Start Date -->
            <FormDatetime 
              id="start_date"
              label="Start Date"
              v-model="form.start_date"
              type="datetime-local"
              :error="errors.start_date"
              @update:modelValue="checkDateChange"
              required
            />
            
            <!-- End Date -->
            <FormDatetime 
              id="end_date"
              label="End Date"
              v-model="form.end_date"
              type="datetime-local"
              :min="form.start_date"
              :error="errors.end_date"
              @update:modelValue="checkDateChange"
              required
            />
            
            <!-- Passengers -->
            <FormInput 
              id="passengers"
              label="Number of Passengers"
              v-model="form.passengers"
              type="number"
              placeholder="Enter number of passengers"
              :error="errors.passengers"
              min="1"
              step="1"
            />
            
            <!-- Notes -->
            <FormTextarea 
              id="notes"
              label="Additional Notes"
              v-model="form.notes"
              placeholder="Enter any additional information"
              :error="errors.notes"
              rows="3"
            />
          </div>
          
          <!-- Availability check button -->
          <div v-if="form.start_date && form.end_date" class="mt-6">
            <button
              type="button"
              @click="checkAvailability"
              :disabled="checkingAvailability"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span v-if="checkingAvailability" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span v-else class="material-icons mr-2 text-sm">search</span>
              Check Vehicle Availability
            </button>
          </div>
        </BaseForm>
        
        <!-- Error state if booking not found -->
        <div v-else class="text-center py-6">
          <span class="material-icons text-4xl text-gray-400 dark:text-gray-500">error</span>
          <h2 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Booking not found</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            The booking you are trying to edit does not exist or you don't have permission to edit it.
          </p>
          <div class="mt-4">
            <router-link 
              to="/bookings" 
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Bookings
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import moment from 'moment';
  import PageHeader from '@/components/common/PageHeader.vue';
  import BaseForm from '@/components/common/BaseForm.vue';
  import FormInput from '@/components/common/FormInput.vue';
  import FormSelect from '@/components/common/FormSelect.vue';
  import FormTextarea from '@/components/common/FormTextarea.vue';
  import FormDatetime from '@/components/common/FormDatetime.vue';
  
  export default {
    name: 'BookingEdit',
    components: {
      PageHeader,
      BaseForm,
      FormInput,
      FormSelect,
      FormTextarea,
      FormDatetime
    },
    setup() {
      const store = useStore();
      const route = useRoute();
      const router = useRouter();
      
      // Get booking ID from route params
      const bookingId = route.params.id;
      
      // Reactive state
      const loading = ref(true);
      const submitting = ref(false);
      const checkingAvailability = ref(false);
      const booking = ref(null);
      const vehicles = ref([]);
      const form = ref({
        vehicle_id: '',
        purpose: '',
        start_date: '',
        end_date: '',
        passengers: '',
        notes: ''
      });
      const errors = ref({});
      
      // Computed properties
      const availableVehicles = computed(() => {
        const options = vehicles.value.map(vehicle => ({
          value: vehicle.id,
          text: `${vehicle.registration_no} - ${vehicle.vehicleType.name} (${vehicle.location.name})`
        }));
        
        // If current vehicle is not in the list of available vehicles, add it
        if (booking.value && form.value.vehicle_id) {
          const currentVehicle = booking.value.vehicle;
          const vehicleExists = options.some(option => option.value === currentVehicle.id);
          
          if (!vehicleExists) {
            options.unshift({
              value: currentVehicle.id,
              text: `${currentVehicle.registration_no} - ${currentVehicle.vehicleType.name} (${currentVehicle.location.name}) - Current`
            });
          }
        }
        
        return options;
      });
      
      // Methods
      const fetchBooking = async () => {
        loading.value = true;
        
        try {
          const response = await store.dispatch('bookings/fetchBooking', bookingId);
          booking.value = response;
          
          // Format datetime strings for form inputs
          const formatDateTime = (dateString) => {
            return moment(dateString).format('YYYY-MM-DDTHH:mm');
          };
          
          // Initialize form with booking data
          form.value = {
            vehicle_id: booking.value.vehicle_id.toString(),
            purpose: booking.value.purpose,
            start_date: formatDateTime(booking.value.start_date),
            end_date: formatDateTime(booking.value.end_date),
            passengers: booking.value.passengers ? booking.value.passengers.toString() : '',
            notes: booking.value.notes || ''
          };
          
          // Add current vehicle to available vehicles
          vehicles.value = [booking.value.vehicle];
        } catch (error) {
          console.error('Error fetching booking:', error);
          store.dispatch('setError', 'Failed to fetch booking details');
          booking.value = null;
        } finally {
          loading.value = false;
        }
      };
      
      const checkDateChange = () => {
        // If both dates are set and they've changed from the original, check availability
        if (form.value.start_date && form.value.end_date) {
          const originalStart = moment(booking.value.start_date).format('YYYY-MM-DDTHH:mm');
          const originalEnd = moment(booking.value.end_date).format('YYYY-MM-DDTHH:mm');
          
          if (form.value.start_date !== originalStart || form.value.end_date !== originalEnd) {
            checkAvailability();
          }
        }
      };
      
      const checkAvailability = async () => {
        if (!form.value.start_date || !form.value.end_date) {
          return;
        }
        
        checkingAvailability.value = true;
        errors.value = {}; // Clear previous errors
        
        try {
          const filters = {
            start_date: form.value.start_date,
            end_date: form.value.end_date
          };
          
          // Fetch available vehicles for the date range
          const response = await store.dispatch('vehicles/checkVehicleAvailability', filters);
          
          // Add current vehicle to the list if it's not already included
          const currentVehicleId = booking.value.vehicle_id;
          const currentVehicleIncluded = response.some(v => v.id === currentVehicleId);
          
          if (!currentVehicleIncluded) {
            // Keep the current vehicle in the list with special marking
            response.unshift(booking.value.vehicle);
          }
          
          vehicles.value = response;
          
          // If no vehicles available (excluding current), show a warning
          if (response.length === 0) {
            errors.value.vehicle_id = 'No vehicles available for the selected date range';
          }
        } catch (error) {
          console.error('Error checking availability:', error);
          store.dispatch('setError', 'Failed to check vehicle availability');
        } finally {
          checkingAvailability.value = false;
        }
      };
      
      const validateForm = () => {
        const newErrors = {};
        
        // Required fields validation
        if (!form.value.vehicle_id) {
          newErrors.vehicle_id = 'Vehicle is required';
        }
        
        if (!form.value.purpose) {
          newErrors.purpose = 'Purpose is required';
        }
        
        if (!form.value.start_date) {
          newErrors.start_date = 'Start date is required';
        }
        
        if (!form.value.end_date) {
          newErrors.end_date = 'End date is required';
        }
        
        // Date validation
        if (form.value.start_date && form.value.end_date) {
          const start = new Date(form.value.start_date);
          const end = new Date(form.value.end_date);
          
          if (start >= end) {
            newErrors.end_date = 'End date must be after start date';
          }
        }
        
        errors.value = newErrors;
        return Object.keys(newErrors).length === 0;
      };
      
      const submitForm = async () => {
        if (!validateForm()) {
          return;
        }
        
        submitting.value = true;
        
        try {
          // Format data for API
          const bookingData = {
            ...form.value
          };
          
          // Convert passengers to number if provided
          if (bookingData.passengers) {
            bookingData.passengers = Number(bookingData.passengers);
          }
          
          // Submit booking update
          await store.dispatch('bookings/updateBooking', {
            id: bookingId,
            bookingData
          });
          
          // Show success message
          store.dispatch('setSuccessMessage', 'Booking updated successfully');
          
          // Redirect back to booking details
          router.push(`/bookings/${bookingId}`);
        } catch (error) {
          console.error('Error updating booking:', error);
          
          // Set form errors from API response if available
          if (error.response && error.response.data && error.response.data.errors) {
            errors.value = error.response.data.errors;
          } else {
            store.dispatch('setError', 'Failed to update booking');
          }
        } finally {
          submitting.value = false;
        }
      };
      
      // Lifecycle hooks
      onMounted(() => {
        fetchBooking();
      });
      
      return {
        loading,
        submitting,
        checkingAvailability,
        booking,
        vehicles,
        form,
        errors,
        availableVehicles,
        checkDateChange,
        checkAvailability,
        submitForm
      };
    }
  };
  </script>