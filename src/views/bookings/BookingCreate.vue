<template>
  <div>
    <PageHeader title="Create Booking" subtitle="Request a new vehicle booking" />

    <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <BaseForm :loading="loading" :submit-text="'Create Booking'" @submit="submitForm" @cancel="$router.push('/bookings')">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">


          <FormSelect 
    id="location_id" 
    label="Location" 
    v-model="form.location_id" 
    :options="locationOptions" 
    :error="errors.location_id" 
    placeholder="Select Location (optional)" 
  />
  
  <!-- Add vehicle type filter -->
  <FormSelect 
    id="vehicle_type_id" 
    label="Vehicle Type" 
    v-model="form.vehicle_type_id" 
    :options="vehicleTypeOptions" 
    :error="errors.vehicle_type_id" 
    placeholder="Select Vehicle Type (optional)" 
  />
          
          <!-- Vehicle Selection -->
          <FormSelect id="vehicle_id" label="Vehicle" v-model="form.vehicle_id" :options="availableVehicles" :error="errors.vehicle_id" :hint="availableVehicles.length ? 'Select a vehicle from the list' : 'No vehicles available for the selected date range'" required />

          <!-- Purpose -->
          <FormInput id="purpose" label="Purpose" v-model="form.purpose" placeholder="Enter booking purpose" :error="errors.purpose" required />

          <!-- Start Date -->
          <FormDatetime id="start_date" label="Start Date" v-model="form.start_date" type="datetime-local" :min="minDate" :error="errors.start_date" @update:modelValue="checkDateChange" required />

          <!-- End Date -->
          <FormDatetime id="end_date" label="End Date" v-model="form.end_date" type="datetime-local" :min="form.start_date || minDate" :error="errors.end_date" @update:modelValue="checkDateChange" required />

          <!-- Passengers -->
          <FormInput id="passengers" label="Number of Passengers" v-model="form.passengers" type="number" placeholder="Enter number of passengers" :error="errors.passengers" min="1" step="1" />

          <!-- Notes -->
          <FormTextarea id="notes" label="Additional Notes" v-model="form.notes" placeholder="Enter any additional information" :error="errors.notes" rows="3" />
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
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import PageHeader from '@/components/common/PageHeader.vue';
import BaseForm from '@/components/common/BaseForm.vue';
import FormInput from '@/components/common/FormInput.vue';
import FormSelect from '@/components/common/FormSelect.vue';
import FormTextarea from '@/components/common/FormTextarea.vue';
import FormDatetime from '@/components/common/FormDatetime.vue';

export default {
  name: 'BookingCreate',
  components: {
    PageHeader,
    BaseForm,
    FormInput,
    FormSelect,
    FormTextarea,
    FormDatetime,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    // Reactive state
    const loading = ref(false);
    const checkingAvailability = ref(false);
    const vehicles = ref([]);
    const vehicleTypes = ref([]);
    const locations = ref([]);
    const form = ref({
      vehicle_id: '',
      purpose: '',
      start_date: '',
      end_date: '',
      passengers: '',
      notes: '',
    });
    const errors = ref({});

    // Computed properties
    const minDate = computed(() => {
      // Format current date and time as YYYY-MM-DDTHH:MM
      const now = new Date();
      return now.toISOString().slice(0, 16);
    });

    const locationOptions = computed(() => {
  return locations.value.map((location) => ({
    value: location.id,
    text: location.name
  }));
});

const vehicleTypeOptions = computed(() => {
  return vehicleTypes.value.map((type) => ({
    value: type.id,
    text: type.name
  }));
});

    const availableVehicles = computed(() => {
      if (!vehicles.value || !Array.isArray(vehicles.value)) {
        console.warn('vehicles.value is not an array:', vehicles.value);
        return [];
      }

      return vehicles.value.map((vehicle) => {
        // Handle potential missing nested properties
        const vehicleTypeName = vehicle.vehicleType?.name || 'Unknown Type';
        const locationName = vehicle.location?.name || 'Unknown Location';
        const regNo = vehicle.registration_no || `Vehicle #${vehicle.id || 'Unknown'}`;

        return {
          value: vehicle.id,
          text: `${regNo} - ${vehicleTypeName} (${locationName})`,
        };
      });
    });

    // Methods
    const fetchInitialData = async () => {
      try {
        // Fetch vehicle types
        const typesResponse = await store.dispatch('vehicleTypes/fetchVehicleTypes');
        vehicleTypes.value = typesResponse;

        // Fetch locations
        const locationsResponse = await store.dispatch('locations/fetchLocations');
        locations.value = locationsResponse;

        // NEW CODE: Fetch all available vehicles initially (without date filters)
        try {
    // New code to preload all vehicles
    const vehiclesResponse = await store.dispatch('vehicles/fetchVehicles', { 
      filters: { status: 'Available' } 
    });
    vehicles.value = vehiclesResponse.data || [];
        } catch (vehicleError) {
          console.error('Error fetching vehicles:', vehicleError);
          // Don't block the form if vehicle fetch fails
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        store.dispatch('setError', 'Failed to load form data');
      }
    };

    // Add this function to fetch vehicles without date filters
    const fetchInitialVehicles = async () => {
      try {
        // Get all available vehicles without date filtering
        const response = await store.dispatch('vehicles/fetchVehicles', {
          filters: { status: 'Available' },
        });

        // If response has data property, use it, otherwise use the response itself
        vehicles.value = response.data || response;

        console.log('Initial vehicles loaded:', vehicles.value);
      } catch (error) {
        console.error('Error fetching initial vehicles:', error);
        store.dispatch('setError', 'Failed to load available vehicles');
      }
    };

    const checkDateChange = () => {
      // If both dates are set, check availability automatically
      if (form.value.start_date && form.value.end_date) {
        checkAvailability();
      }
    };

    // Add this function to ensure dates are properly formatted
    const formatDateForAPI = (dateString) => {
      // Return formatted date based on your backend's expected format
      const date = new Date(dateString);
      return date.toISOString();
    };

    const checkAvailability = async () => {
      if (!form.value.start_date || !form.value.end_date) {
        return;
      }

      checkingAvailability.value = true;
      errors.value = {}; // Clear previous errors

      try {
        const filters = {
          start_date: formatDateForAPI(form.value.start_date),
          end_date: formatDateForAPI(form.value.end_date),
        };

        // Add location filter if set
        if (form.value.location_id) {
          filters.location_id = form.value.location_id;
        }

            // Log the filters being sent to the API
    console.log('Checking availability with filters:', filters);

        // Add vehicle type filter if set
        if (form.value.vehicle_type_id) {
          filters.vehicle_type_id = form.value.vehicle_type_id;
        }

        // Fetch available vehicles for the date range
        const response = await store.dispatch('vehicles/checkVehicleAvailability', filters);
        console.log('Available vehicles response:', response);

        vehicles.value = response;

        // Make sure we're setting the correct data property

        if (Array.isArray(response)) {
          vehicles.value = response;
        } else if (response.data && Array.isArray(response.data)) {
          vehicles.value = response.data;
        } else {
          console.error('Unexpected vehicle response format:', response);
          vehicles.value = [];
        }

        // Log the mapped options for debugging
        console.log('Available vehicle options:', availableVehicles.value);

        // If no vehicles available, show an error
        if (response.length === 0) {
          errors.value.vehicle_id = 'No vehicles available for the selected date range';
          form.value.vehicle_id = ''; // Reset vehicle selection
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

      loading.value = true;

      try {
        // Format data for API
        const bookingData = {
          ...form.value,
        };

        // Convert passengers to number if provided
        if (bookingData.passengers) {
          bookingData.passengers = Number(bookingData.passengers);
        }

        // Submit booking request
        await store.dispatch('bookings/createBooking', bookingData);

        // Show success message
        store.dispatch('setSuccessMessage', 'Booking created successfully');

        // Redirect to bookings list
        router.push('/bookings');
      } catch (error) {
        console.error('Error creating booking:', error);

        // Set form errors from API response if available
        if (error.response && error.response.data && error.response.data.errors) {
          errors.value = error.response.data.errors;
        } else {
          store.dispatch('setError', 'Failed to create booking');
        }
      } finally {
        loading.value = false;
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      fetchInitialData();
      fetchInitialVehicles(); // Add this line to fetch vehicles on mount
    });

    return {
      loading,
      checkingAvailability,
      vehicles,
      vehicleTypes,
      locations,
      form,
      errors,
      minDate,
      availableVehicles,
      checkDateChange,
      checkAvailability,
      submitForm,
    };
  },
};
</script>

<!-- src/views/bookings/BookingCreate.vue -->
