<template>
    <div>
      <PageHeader 
        title="Edit Vehicle" 
        :subtitle="vehicle ? `${vehicle.registration_no}` : 'Loading...'"
      />
      
      <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <!-- Loading state -->
        <div v-if="loading && !vehicle" class="animate-pulse space-y-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        
        <!-- Edit form when data is loaded -->
        <BaseForm 
          v-else-if="vehicle"
          :loading="submitting" 
          :submit-text="'Update Vehicle'" 
          @submit="submitForm" 
          @cancel="$router.push(`/vehicles/${vehicle.id}`)"
        >
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Registration Number -->
            <FormInput 
              id="registration_no"
              label="Registration Number"
              v-model="form.registration_no"
              placeholder="Enter vehicle registration number"
              :error="errors.registration_no"
              required
            />
            
            <!-- Vehicle Type -->
            <FormSelect 
              id="vehicle_type_id"
              label="Vehicle Type"
              v-model="form.vehicle_type_id"
              :options="vehicleTypeOptions"
              :error="errors.vehicle_type_id"
              required
            />
            
            <!-- Location -->
            <FormSelect 
              id="location_id"
              label="Location"
              v-model="form.location_id"
              :options="locationOptions"
              :error="errors.location_id"
              required
            />
            
            <!-- Status -->
            <FormSelect 
              id="status"
              label="Status"
              v-model="form.status"
              :options="statusOptions"
              :error="errors.status"
              required
            />
            
            <!-- Is Rented -->
            <FormCheckbox 
              id="is_rented"
              label="Rented Vehicle"
              v-model="form.is_rented"
              description="Check if this vehicle is rented rather than owned by the company"
              :error="errors.is_rented"
            />
          </div>
        </BaseForm>
        
        <!-- Error state if vehicle not found -->
        <div v-else class="text-center py-6">
          <span class="material-icons text-4xl text-gray-400 dark:text-gray-500">error</span>
          <h2 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Vehicle not found</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            The vehicle you are trying to edit does not exist or you don't have permission to edit it.
          </p>
          <div class="mt-4">
            <router-link 
              to="/vehicles" 
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Vehicles
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
  import PageHeader from '@/components/common/PageHeader.vue';
  import BaseForm from '@/components/common/BaseForm.vue';
  import FormInput from '@/components/common/FormInput.vue';
  import FormSelect from '@/components/common/FormSelect.vue';
  import FormCheckbox from '@/components/common/FormCheckbox.vue';
  
  export default {
    name: 'VehicleEdit',
    components: {
      PageHeader,
      BaseForm,
      FormInput,
      FormSelect,
      FormCheckbox
    },
    setup() {
      const store = useStore();
      const route = useRoute();
      const router = useRouter();
      
      // Get vehicle ID from route params
      const vehicleId = route.params.id;
      
      // Reactive state
      const loading = ref(true);
      const submitting = ref(false);
      const vehicle = ref(null);
      const vehicleTypes = ref([]);
      const locations = ref([]);
      const form = ref({
        registration_no: '',
        vehicle_type_id: '',
        location_id: '',
        status: '',
        is_rented: false
      });
      const errors = ref({});
      
      // Computed properties
      const vehicleTypeOptions = computed(() => {
        return vehicleTypes.value.map(type => ({
          value: type.id.toString(),
          text: `${type.name} (Capacity: ${type.capacity})`
        }));
      });
      
      const locationOptions = computed(() => {
        return locations.value.map(location => ({
          value: location.id.toString(),
          text: `${location.name} (${location.type})`
        }));
      });
      
      const statusOptions = computed(() => [
        { value: 'Available', text: 'Available' },
        { value: 'Booked', text: 'Booked' },
        { value: 'Maintenance', text: 'Maintenance' }
      ]);
      
      // Methods
      const fetchData = async () => {
        loading.value = true;
        
        try {
          // Fetch vehicle
          const vehicleResponse = await store.dispatch('vehicles/fetchVehicle', vehicleId);
          vehicle.value = vehicleResponse;
          
          // Fetch vehicle types
          const typesResponse = await store.dispatch('vehicleTypes/fetchVehicleTypes');
          vehicleTypes.value = typesResponse;
          
          // Fetch locations
          const locationsResponse = await store.dispatch('locations/fetchLocations');
          locations.value = locationsResponse;
          
          // Initialize form with vehicle data
          form.value = {
            registration_no: vehicle.value.registration_no,
            vehicle_type_id: vehicle.value.vehicle_type_id.toString(),
            location_id: vehicle.value.location_id.toString(),
            status: vehicle.value.status,
            is_rented: vehicle.value.is_rented
          };
        } catch (error) {
          console.error('Error fetching data:', error);
          store.dispatch('setError', 'Failed to fetch vehicle data');
          vehicle.value = null;
        } finally {
          loading.value = false;
        }
      };
      
      const validateForm = () => {
        const newErrors = {};
        
        // Required fields validation
        if (!form.value.registration_no) {
          newErrors.registration_no = 'Registration number is required';
        }
        
        if (!form.value.vehicle_type_id) {
          newErrors.vehicle_type_id = 'Vehicle type is required';
        }
        
        if (!form.value.location_id) {
          newErrors.location_id = 'Location is required';
        }
        
        if (!form.value.status) {
          newErrors.status = 'Status is required';
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
          const vehicleData = {
            ...form.value,
            vehicle_type_id: parseInt(form.value.vehicle_type_id),
            location_id: parseInt(form.value.location_id)
          };
          
          // Submit vehicle update
          await store.dispatch('vehicles/updateVehicle', {
            id: vehicleId,
            vehicleData
          });
          
          // Show success message
          store.dispatch('setSuccessMessage', 'Vehicle updated successfully');
          
          // Redirect back to vehicle details
          router.push(`/vehicles/${vehicleId}`);
        } catch (error) {
          console.error('Error updating vehicle:', error);
          
          // Set form errors from API response if available
          if (error.response && error.response.data && error.response.data.errors) {
            errors.value = error.response.data.errors;
          } else {
            store.dispatch('setError', 'Failed to update vehicle');
          }
        } finally {
          submitting.value = false;
        }
      };
      
      // Lifecycle hooks
      onMounted(() => {
        fetchData();
      });
      
      return {
        loading,
        submitting,
        vehicle,
        form,
        errors,
        vehicleTypeOptions,
        locationOptions,
        statusOptions,
        submitForm
      };
    }
  };
  </script>