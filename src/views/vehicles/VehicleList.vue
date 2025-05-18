<template>
  <div>
    <PageHeader title="Vehicles" subtitle="Manage your fleet vehicles">
      <template #actions>
        <router-link v-if="isAdmin" to="/vehicles/create" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <span class="material-icons -ml-1 mr-2 text-sm">add</span>
          Add Vehicle
        </router-link>
      </template>
    </PageHeader>

    <div class="mt-6">
      <DataTable :columns="columns" :data="vehicles" :loading="loading" :pagination="pagination" :filters="filters" row-clickable @row-click="viewVehicle" @page-change="changePage" @search="onSearch" @filter="onFilter" :get-row-class="getRowClass">
        <!-- Vehicle type formatter -->
        <template #[`cell(vehicle_type.name)`]="{ item }">
          {{ item.vehicle_type.name }}
        </template>

        <!-- Location formatter -->
        <template #[`cell(location.name)`]="{ item }">
          {{ item.location.name }}
        </template>

        <!-- Status formatter -->
        <template #[`cell(status)`]="{ item }">
          <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', item.status === 'Available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : item.status === 'Booked' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300']">
            {{ item.status }}
          </span>
        </template>

        <!-- Is rented formatter -->
        <template #[`cell(is_rented)`]="{ item }">
          <span v-if="item.is_rented" class="text-yellow-600 dark:text-yellow-400 flex items-center"> <span class="material-icons text-sm mr-1">check</span> Yes </span>
          <span v-else class="text-gray-600 dark:text-gray-400 flex items-center"> <span class="material-icons text-sm mr-1">close</span> No </span>
        </template>

        <!-- Actions column -->
        <template #actions="{ item }">
          <div v-if="item && item.id" class="flex items-center space-x-3">
            <router-link :to="`/vehicles/${item.id}`" class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300" title="View vehicle details">
              <span class="material-icons text-sm">visibility</span>
            </router-link>

            <router-link v-if="isAdmin" :to="`/vehicles/${item.id}/edit`" class="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300" title="Edit vehicle">
              <span class="material-icons text-sm">edit</span>
            </router-link>

            <button v-if="isAdmin && item.status !== 'Booked'" @click.stop="confirmDelete(item)" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300" title="Delete vehicle">
              <span class="material-icons text-sm">delete</span>
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Confirmation dialog for delete -->
    <div v-if="showDeleteDialog" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteDialog = false"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                <span class="material-icons text-red-600 dark:text-red-400">warning</span>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">Delete Vehicle</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete the vehicle "{{ vehicleToDelete?.registration_no }}"? This action cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="deleteVehicle" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Delete</button>
            <button
              @click="showDeleteDialog = false"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import PageHeader from '@/components/common/PageHeader.vue';
import DataTable from '@/components/common/DataTable.vue';

export default {
  name: 'VehicleList',
  components: {
    PageHeader,
    DataTable,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    // Reactive state
    const loading = ref(false);
    const vehicles = ref([]);
    const pagination = ref({
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
    });
    const filters = ref([
      {
        name: 'status',
        placeholder: 'All Statuses',
        options: [
          { value: 'Available', text: 'Available' },
          { value: 'Booked', text: 'Booked' },
          { value: 'Maintenance', text: 'Maintenance' },
        ],
      },
      {
        name: 'is_rented',
        placeholder: 'All Vehicles',
        options: [
          { value: 'true', text: 'Rented' },
          { value: 'false', text: 'Owned' },
        ],
      },
    ]);
    const searchTerm = ref('');
    const selectedFilters = ref({});
    const showDeleteDialog = ref(false);
    const vehicleToDelete = ref(null);

    // Computed properties
    const isAdmin = computed(() => store.getters['auth/isAdmin']);

    const columns = [
      { key: 'registration_no', label: 'Registration No', sortable: true },
      { key: 'vehicle_type.name', label: 'Type', sortable: true },
      { key: 'location.name', label: 'Location', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'is_rented', label: 'Rented', sortable: true },
    ];

    // Methods
    const fetchVehicles = async () => {
      loading.value = true;

      try {
        const response = await store.dispatch('vehicles/fetchVehicles', {
          page: pagination.value.currentPage,
          filters: {
            search: searchTerm.value,
            ...selectedFilters.value,
          },
        });

        vehicles.value = response.data;

        // Update pagination
        pagination.value = {
          currentPage: response.current_page,
          itemsPerPage: response.per_page,
          totalItems: response.total,
          totalPages: Math.ceil(response.total / response.per_page),
        };
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        store.dispatch('setError', 'Failed to fetch vehicles');
        vehicles.value = [];  // Important: Initialize as empty array
      } finally {
        loading.value = false;
      }
    };

    const changePage = (page) => {
      pagination.value.currentPage = page;
      fetchVehicles();
    };

    const onSearch = (search) => {
      searchTerm.value = search;
      pagination.value.currentPage = 1; // Reset to first page
      fetchVehicles();
    };

    const onFilter = (filters) => {
      selectedFilters.value = filters;
      pagination.value.currentPage = 1; // Reset to first page
      fetchVehicles();
    };

    const viewVehicle = (vehicle) => {
      router.push(`/vehicles/${vehicle.id}`);
    };

    const confirmDelete = (vehicle) => {
      vehicleToDelete.value = vehicle;
      showDeleteDialog.value = true;
    };

    const deleteVehicle = async () => {
      if (!vehicleToDelete.value) return;

      try {
        await store.dispatch('vehicles/deleteVehicle', vehicleToDelete.value.id);

        // Close dialog
        showDeleteDialog.value = false;
        vehicleToDelete.value = null;

        // Show success message
        store.dispatch('setSuccessMessage', 'Vehicle deleted successfully');

        // Refresh vehicles list
        fetchVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);

        // Show specific error from API if available
        if (error.response && error.response.data && error.response.data.message) {
          store.dispatch('setError', error.response.data.message);
        } else {
          store.dispatch('setError', 'Failed to delete vehicle');
        }
      }
    };

    const getRowClass = (item) => {
      if (item.status === 'Maintenance') {
        return 'bg-red-50 dark:bg-red-900/10';
      } else if (item.status === 'Booked') {
        return 'bg-blue-50 dark:bg-blue-900/10';
      }
      return '';
    };

    // Lifecycle hooks
    onMounted(() => {
      fetchVehicles();
    });

    return {
      loading,
      vehicles,
      columns,
      pagination,
      filters,
      isAdmin,
      showDeleteDialog,
      vehicleToDelete,
      changePage,
      onSearch,
      onFilter,
      viewVehicle,
      confirmDelete,
      deleteVehicle,
      getRowClass,
    };
  },
};
</script>

<!-- frontend/src/views/vehicles/VehicleList.vue -->