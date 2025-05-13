<template>
    <div>
      <PageHeader 
        title="Bookings" 
        subtitle="Manage vehicle booking requests"
      >
        <template #actions>
          <router-link 
            to="/bookings/create" 
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span class="material-icons -ml-1 mr-2 text-sm">add</span>
            New Booking
          </router-link>
        </template>
      </PageHeader>
      
      <div class="mt-6">
        <DataTable
          :columns="columns"
          :data="bookings"
          :loading="loading"
          :pagination="pagination"
          :filters="filters"
          row-clickable
          @row-click="viewBooking"
          @page-change="changePage"
          @search="onSearch"
          @filter="onFilter"
        >
          <!-- Cell formatters -->
          <template #[`cell(vehicle)`]="{ item }">
            {{ item.vehicle.registration_no }} ({{ item.vehicle.vehicleType.name }})
          </template>
          
          <template #[`cell(start_date)`]="{ item }">
            {{ formatDate(item.start_date) }}
          </template>
          
          <template #[`cell(end_date)`]="{ item }">
            {{ formatDate(item.end_date) }}
          </template>
          
          <template #[`cell(status)`]="{ item }">
            <span :class="[
              'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
              item.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
              item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
              item.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            ]">
              {{ item.status }}
            </span>
          </template>
          
          <!-- Actions column -->
          <template #actions="{ item }">
            <div class="flex items-center space-x-2">
              <router-link 
                :to="`/bookings/${item.id}`" 
                class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                title="View booking details"
              >
                <span class="material-icons text-sm">visibility</span>
              </router-link>
              
              <router-link 
                v-if="canEdit(item)"
                :to="`/bookings/${item.id}/edit`" 
                class="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                title="Edit booking"
              >
                <span class="material-icons text-sm">edit</span>
              </router-link>
              
              <button 
                v-if="canComplete(item)"
                @click.stop="completeBooking(item)"
                class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                title="Mark as completed"
              >
                <span class="material-icons text-sm">check_circle</span>
              </button>
              
              <button 
                v-if="canCancel(item)"
                @click.stop="confirmCancel(item)"
                class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                title="Cancel booking"
              >
                <span class="material-icons text-sm">cancel</span>
              </button>
            </div>
          </template>
        </DataTable>
      </div>
      
      <!-- Confirmation dialog for cancel -->
      <div v-if="showCancelDialog" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showCancelDialog = false"></div>
          
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                  <span class="material-icons text-red-600 dark:text-red-400">warning</span>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                    Cancel Booking
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to cancel this booking? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="cancelBooking"
                type="button" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel Booking
              </button>
              <button 
                @click="showCancelDialog = false"
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Back
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
  import moment from 'moment';
  import PageHeader from '@/components/common/PageHeader.vue';
  import DataTable from '@/components/common/DataTable.vue';
  
  export default {
    name: 'BookingList',
    components: {
      PageHeader,
      DataTable
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      
      // Reactive state
      const loading = ref(false);
      const bookings = ref([]);
      const pagination = ref({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
      });
      const filters = ref([
        {
          name: 'status',
          placeholder: 'All Statuses',
          options: [
            { value: 'Pending', text: 'Pending' },
            { value: 'Approved', text: 'Approved' },
            { value: 'Rejected', text: 'Rejected' },
            { value: 'Completed', text: 'Completed' },
            { value: 'Cancelled', text: 'Cancelled' }
          ]
        }
      ]);
      const searchTerm = ref('');
      const selectedFilters = ref({});
      const showCancelDialog = ref(false);
      const bookingToCancel = ref(null);
      
      // Computed properties
      const columns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'user.name', label: 'Requester', sortable: true },
        { key: 'vehicle', label: 'Vehicle', sortable: true },
        { key: 'purpose', label: 'Purpose', sortable: true },
        { key: 'start_date', label: 'Start Date', sortable: true },
        { key: 'end_date', label: 'End Date', sortable: true },
        { key: 'status', label: 'Status', sortable: true }
      ];
      
      const currentUser = computed(() => store.getters['auth/user']);
      const isAdmin = computed(() => store.getters['auth/isAdmin']);
      
      // Methods
      const fetchBookings = async () => {
        loading.value = true;
        
        try {
          const response = await store.dispatch('bookings/fetchBookings', {
            page: pagination.value.currentPage,
            filters: {
              search: searchTerm.value,
              ...selectedFilters.value
            }
          });
          
          bookings.value = response.data;
          
          // Update pagination
          pagination.value = {
            currentPage: response.current_page,
            itemsPerPage: response.per_page,
            totalItems: response.total,
            totalPages: Math.ceil(response.total / response.per_page)
          };
        } catch (error) {
          console.error('Error fetching bookings:', error);
          store.dispatch('setError', 'Failed to fetch bookings');
        } finally {
          loading.value = false;
        }
      };
      
      const changePage = (page) => {
        pagination.value.currentPage = page;
        fetchBookings();
      };
      
      const onSearch = (search) => {
        searchTerm.value = search;
        pagination.value.currentPage = 1; // Reset to first page
        fetchBookings();
      };
      
      const onFilter = (filters) => {
        selectedFilters.value = filters;
        pagination.value.currentPage = 1; // Reset to first page
        fetchBookings();
      };
      
      const viewBooking = (booking) => {
        router.push(`/bookings/${booking.id}`);
      };
      
      const formatDate = (dateString) => {
        return moment(dateString).format('MMM D, YYYY h:mm A');
      };
      
      // Permissions for actions
      const canEdit = (booking) => {
        // Can edit if admin or if user is the requester and booking is still pending
        return isAdmin.value || 
          (booking.user_id === currentUser.value?.id && booking.status === 'Pending');
      };
      
      const canComplete = (booking) => {
        // Can complete if approved and user is requester or admin
        return booking.status === 'Approved' && 
          (booking.user_id === currentUser.value?.id || isAdmin.value);
      };
      
      const canCancel = (booking) => {
        // Can cancel if pending or approved and user is requester or admin
        return ['Pending', 'Approved'].includes(booking.status) && 
          (booking.user_id === currentUser.value?.id || isAdmin.value);
      };
      
      const confirmCancel = (booking) => {
        bookingToCancel.value = booking;
        showCancelDialog.value = true;
      };
      
      const cancelBooking = async () => {
        if (!bookingToCancel.value) return;
        
        try {
          await store.dispatch('bookings/cancelBooking', bookingToCancel.value.id);
          showCancelDialog.value = false;
          bookingToCancel.value = null;
          
          // Refresh the bookings list
          fetchBookings();
        } catch (error) {
          console.error('Error cancelling booking:', error);
          store.dispatch('setError', 'Failed to cancel booking');
        }
      };
      
      const completeBooking = async (booking) => {
        try {
          await store.dispatch('bookings/completeBooking', booking.id);
          
          // Refresh the bookings list
          fetchBookings();
        } catch (error) {
          console.error('Error completing booking:', error);
          store.dispatch('setError', 'Failed to mark booking as completed');
        }
      };
      
      // Lifecycle hooks
      onMounted(() => {
        fetchBookings();
      });
      
      return {
        loading,
        bookings,
        columns,
        pagination,
        filters,
        showCancelDialog,
        bookingToCancel,
        changePage,
        onSearch,
        onFilter,
        viewBooking,
        formatDate,
        canEdit,
        canComplete,
        canCancel,
        confirmCancel,
        cancelBooking,
        completeBooking
      };
    }
  };
  </script>