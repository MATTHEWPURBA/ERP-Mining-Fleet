<template>
    <div>
      <PageHeader 
        title="Add Vehicle" 
        subtitle="Add a new vehicle to the fleet"
      />
      
      <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <BaseForm 
          :loading="loading" 
          :submit-text="'Add Vehicle'" 
          @submit="submitForm" 
          @cancel="$router.push('/vehicles')"
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
              :hint="vehicleTypeOptions.length ? '' : 'No vehicle types available. Please add vehicle types first.'"
              required
            />
            
            <!-- Location -->
            <FormSelect 
              id="location_id"
              label="Location"
              v-model="form.location_id"
              :options="locationOptions"
              :error="errors.location_id"
              :hint="locationOptions.length ? '' : 'No locations available. Please add locations first.'"
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
  import FormCheckbox from '@/components/common/FormCheckbox.vue';
  
  export default {
    name: 'VehicleCreate',
    components: {
      PageHeader,
      BaseForm,
      FormInput,
      FormSelect,
      FormCheckbox
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      
      // Reactive state
      const loading = ref(false);
      const vehicleTypes = ref([]);
      const locations = ref([]);
      const form = ref({
        registration_no: '',
        vehicle_type_id: '',
        location_id: '',
        status: 'Available',
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
      const fetchInitialData = async () => {
        loading.value = true;
        
        try {
          // Fetch vehicle types
          const typesResponse = await store.dispatch('vehicleTypes/fetchVehicleTypes');
          vehicleTypes.value = typesResponse;
          
          // Fetch locations
          const locationsResponse = await store.dispatch('locations/fetchLocations');
          locations.value = locationsResponse;
          
          // Set default values if available
          if (vehicleTypes.value.length > 0) {
            form.value.vehicle_type_id = vehicleTypes.value[0].id.toString();
          }
          
          if (locations.value.length > 0) {
            form.value.location_id = locations.value[0].id.toString();
          }
        } catch (error) {
          console.error('Error fetching initial data:', error);
          store.dispatch('setError', 'Failed to load form data');
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
        
        loading.value = true;
        
        try {
          // Format data for API
          const vehicleData = {
            ...form.value,
            vehicle_type_id: parseInt(form.value.vehicle_type_id),
            location_id: parseInt(form.value.location_id)
          };
          
          // Submit vehicle creation
          await store.dispatch('vehicles/createVehicle', vehicleData);
          
          // Show success message
          store.dispatch('setSuccessMessage', 'Vehicle created successfully');
          
          // Redirect to vehicles list
          router.push('/vehicles');
        } catch (error) {
          console.error('Error creating vehicle:', error);
          
          // Set form errors from API response if available
          if (error.response && error.response.data && error.response.data.errors) {
            errors.value = error.response.data.errors;
          } else {
            store.dispatch('setError', 'Failed to create vehicle');
          }
        } finally {
          loading.value = false;
        }
      };
      
      // Lifecycle hooks
      onMounted(() => {
        fetchInitialData();
      });
      
      return {
        loading,
        vehicleTypes,
        locations,
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