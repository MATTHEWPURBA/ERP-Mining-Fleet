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
      <!-- Show a loading state before data is ready -->
      <div v-if="loading" class="animate-pulse space-y-4">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
      
      <!-- Show error message if fetching failed -->
      <div v-else-if="fetchError" class="bg-red-50 dark:bg-red-900 p-4 rounded-md">
        <p class="text-red-700 dark:text-red-300">{{ fetchError }}</p>
        <button 
          @click="fetchBookings" 
          class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Retry
        </button>
      </div>
      
      <!-- Show DataTable when data is ready and not empty -->
      <DataTable
        v-else-if="bookings && bookings.length > 0"
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
        <!-- Cell formatters with null checks -->
        <template #[`cell(vehicle)`]="{ item }">
          {{ item && item.vehicle ? `${item.vehicle.registration_no} (${item.vehicle.vehicleType?.name || 'Unknown'})` : 'N/A' }}
        </template>
        
        <template #[`cell(start_date)`]="{ item }">
          {{ item && item.start_date ? formatDate(item.start_date) : 'N/A' }}
        </template>
        
        <template #[`cell(end_date)`]="{ item }">
          {{ item && item.end_date ? formatDate(item.end_date) : 'N/A' }}
        </template>
        
        <template #[`cell(status)`]="{ item }">
          <span v-if="item && item.status" :class="[
            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
            item.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
            item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
            item.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          ]">
            {{ item.status }}
          </span>
          <span v-else>N/A</span>
        </template>
        
        <!-- Actions column with null check -->
        <template #actions="{ item }">
          <div v-if="item && item.id" class="flex items-center space-x-2">
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
          <div v-else>
            <span class="text-gray-400">No actions available</span>
          </div>
        </template>
      </DataTable>
      
      <!-- Show empty state when no bookings -->
      <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
        <span class="material-icons text-4xl text-gray-400 dark:text-gray-500">event_busy</span>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No bookings found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          There are no bookings matching your criteria. Try adjusting your filters or create a new booking.
        </p>
        <div class="mt-6">
          <router-link to="/bookings/create" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span class="material-icons -ml-1 mr-2 text-sm">add</span>
            Create New Booking
          </router-link>
        </div>
      </div>
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
    const fetchError = ref(null);
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
      fetchError.value = null;
      
      try {
        // Ensure bookings module exists in store
        if (!store.hasModule('bookings')) {
          console.error('Bookings module not registered in Vuex store');
          fetchError.value = 'Application error: Bookings module not found';
          return;
        }
        
        const response = await store.dispatch('bookings/fetchBookings', {
          page: pagination.value.currentPage,
          filters: {
            search: searchTerm.value,
            ...selectedFilters.value
          }
        });
        
        // Validate response structure
        if (!response || typeof response !== 'object') {
          console.error('Invalid response from bookings/fetchBookings:', response);
          fetchError.value = 'Invalid response from server';
          return;
        }
        
        // Safely extract and store bookings data
        bookings.value = Array.isArray(response.data) ? response.data : [];
        
        // Ensure each booking has required properties
        bookings.value = bookings.value.map(booking => {
          if (!booking) return null;
          
          // Ensure vehicle and vehicleType objects exist to prevent null reference errors
          if (!booking.vehicle) {
            booking.vehicle = { 
              registration_no: 'Unknown', 
              vehicleType: { name: 'Unknown' } 
            };
          } else if (!booking.vehicle.vehicleType) {
            booking.vehicle.vehicleType = { name: 'Unknown' };
          }
          
          // Ensure user object exists
          if (!booking.user) {
            booking.user = { name: 'Unknown' };
          }
          
          return booking;
        }).filter(booking => booking !== null);
        
        // Update pagination with fallbacks for missing properties
        pagination.value = {
          currentPage: response.current_page || 1,
          itemsPerPage: response.per_page || 10,
          totalItems: response.total || 0,
          totalPages: response.last_page || Math.ceil((response.total || 0) / (response.per_page || 10))
        };
      } catch (error) {
        console.error('Error fetching bookings:', error);
        fetchError.value = 'Failed to fetch bookings. Please try again.';
        bookings.value = []; // Reset to empty array on error
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
      if (booking && booking.id) {
        router.push(`/bookings/${booking.id}`);
      } else {
        console.error('Attempted to view booking with no ID:', booking);
        store.dispatch('setError', 'Cannot view booking: Invalid booking data');
      }
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        return moment(dateString).format('MMM D, YYYY h:mm A');
      } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
      }
    };
    
    // Permissions for actions with null checks
    const canEdit = (booking) => {
      if (!booking || !booking.id) return false;
      
      // Can edit if admin or if user is the requester and booking is still pending
      return isAdmin.value || 
        (booking.user_id === currentUser.value?.id && booking.status === 'Pending');
    };
    
    const canComplete = (booking) => {
      if (!booking || !booking.id) return false;
      
      // Can complete if approved and user is requester or admin
      return booking.status === 'Approved' && 
        (booking.user_id === currentUser.value?.id || isAdmin.value);
    };
    
    const canCancel = (booking) => {
      if (!booking || !booking.id) return false;
      
      // Can cancel if pending or approved and user is requester or admin
      return ['Pending', 'Approved'].includes(booking.status) && 
        (booking.user_id === currentUser.value?.id || isAdmin.value);
    };
    
    const confirmCancel = (booking) => {
      if (!booking || !booking.id) {
        console.error('Attempted to cancel booking with no ID:', booking);
        store.dispatch('setError', 'Cannot cancel booking: Invalid booking data');
        return;
      }
      
      bookingToCancel.value = booking;
      showCancelDialog.value = true;
    };
    
    const cancelBooking = async () => {
      if (!bookingToCancel.value || !bookingToCancel.value.id) {
        console.error('No valid booking to cancel');
        store.dispatch('setError', 'Cannot cancel booking: No booking selected');
        showCancelDialog.value = false;
        return;
      }
      
      try {
        await store.dispatch('bookings/cancelBooking', bookingToCancel.value.id);
        showCancelDialog.value = false;
        bookingToCancel.value = null;
        
        // Refresh the bookings list
        fetchBookings();
        
        // Show success message
        store.dispatch('setSuccessMessage', 'Booking cancelled successfully');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        store.dispatch('setError', 'Failed to cancel booking: ' + (error.message || 'Unknown error'));
      }
    };
    
    const completeBooking = async (booking) => {
      if (!booking || !booking.id) {
        console.error('Attempted to complete booking with no ID:', booking);
        store.dispatch('setError', 'Cannot complete booking: Invalid booking data');
        return;
      }
      
      try {
        await store.dispatch('bookings/completeBooking', booking.id);
        
        // Refresh the bookings list
        fetchBookings();
        
        // Show success message
        store.dispatch('setSuccessMessage', 'Booking completed successfully');
      } catch (error) {
        console.error('Error completing booking:', error);
        store.dispatch('setError', 'Failed to mark booking as completed: ' + (error.message || 'Unknown error'));
      }
    };
    
    // Lifecycle hooks
    onMounted(() => {
      fetchBookings();
    });
    
    return {
      loading,
      fetchError,
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
      completeBooking,
      fetchBookings, // Expose for retry button
    };
  }
};
</script>



  <!-- src/views/bookings/BookingList.vue -->
