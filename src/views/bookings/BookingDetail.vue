<template>
  <div>
    <PageHeader :title="`Booking #${booking ? booking.id : '...'}`" :subtitle="booking ? `${booking.vehicle.registration_no} - ${formatDateRange(booking.start_date, booking.end_date)}` : 'Loading...'">
      <template #actions>
        <div class="space-x-2">
          <router-link to="/bookings" class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span class="material-icons mr-2 text-sm">arrow_back</span>
            Back to List
          </router-link>

          <button
            v-if="canEdit"
            @click="$router.push(`/bookings/${booking.id}/edit`)"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span class="material-icons mr-2 text-sm">edit</span>
            Edit
          </button>

          <button v-if="canComplete" @click="completeBooking" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <span class="material-icons mr-2 text-sm">check_circle</span>
            Mark as Completed
          </button>

          <button v-if="canCancel" @click="confirmCancel" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <span class="material-icons mr-2 text-sm">cancel</span>
            Cancel Booking
          </button>
        </div>
      </template>
    </PageHeader>

    <div class="mt-6">
      <!-- Loading state -->
      <div v-if="loading" class="animate-pulse">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="p-6 space-y-4">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>

      <!-- Booking details when loaded -->
      <div v-else-if="booking" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Main booking details -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Booking Details</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Created on {{ formatDate(booking.created_at) }}</p>
            </div>

            <div>
              <span
                :class="[
                  'px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full',
                  booking.status === 'Approved'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : booking.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    : booking.status === 'Rejected'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    : booking.status === 'Completed'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                ]"
              >
                {{ booking.status }}
              </span>
            </div>
          </div>

          <div class="border-b border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Requester</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ booking.user.name }}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Vehicle</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ booking.vehicle.registration_no }} ({{ booking.vehicle.vehicleType.name }})</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ formatDate(booking.start_date) }}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ formatDate(booking.end_date) }}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Purpose</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ booking.purpose }}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Passengers</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ booking.passengers || 'N/A' }}
                </dd>
              </div>

              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ booking.notes || 'No additional notes provided' }}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Approval status and history -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Approval Status</h3>
          </div>

          <div class="p-4 sm:p-6">
            <div v-if="booking.approvals && booking.approvals.length > 0" class="flow-root">
              <ul class="-mb-8">
                <li v-for="(approval, approvalIdx) in booking.approvals" :key="approval.id" class="relative pb-8">
                  <!-- Connect lines between items -->
                  <div v-if="approvalIdx !== booking.approvals.length - 1" class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></div>

                  <div class="relative flex items-start space-x-3">
                    <!-- Status icon -->
                    <div class="relative">
                      <span :class="['h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800', approval.status === 'Approved' ? 'bg-green-500' : approval.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500']">
                        <span class="material-icons text-white">
                          {{ approval.status === 'Approved' ? 'check' : approval.status === 'Rejected' ? 'close' : 'hourglass_empty' }}
                        </span>
                      </span>
                    </div>

                    <!-- Approval details -->
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-sm">
                          <span class="font-medium text-gray-900 dark:text-white"> Level {{ approval.level }} Approval </span>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Approver: {{ approval.approver.name }}</p>
                      </div>
                      <div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        <div class="flex items-center">
                          <span
                            :class="[
                              'px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full',
                              approval.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : approval.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                            ]"
                          >
                            {{ approval.status }}
                          </span>
                          <span v-if="approval.status !== 'Pending'" class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {{ formatDate(approval.updated_at) }}
                          </span>
                        </div>
                        <p v-if="approval.comments" class="mt-2 text-sm text-gray-700 dark:text-gray-300">"{{ approval.comments }}"</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div v-else class="text-center py-4">
              <p class="text-sm text-gray-500 dark:text-gray-400">No approval information available</p>
            </div>
          </div>
        </div>
      </div>

      <!-- No booking found error state -->
      <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="text-center">
          <span class="material-icons text-4xl text-gray-400 dark:text-gray-500">search_off</span>
          <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Booking not found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">The booking you are looking for does not exist or you don't have permission to view it.</p>
          <div class="mt-6">
            <router-link to="/bookings" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"> Go back to bookings </router-link>
          </div>
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
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">Cancel Booking</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="cancelBooking" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Cancel Booking</button>
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
import { useRoute, useRouter } from 'vue-router';
import moment from 'moment';
import PageHeader from '@/components/common/PageHeader.vue';

export default {
  name: 'BookingDetail',
  components: {
    PageHeader,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    // Reactive state
    const loading = ref(true);
    const booking = ref(null);
    const showCancelDialog = ref(false);

    // Get booking ID from route params
    const bookingId = route.params.id;

    // Computed properties
    const currentUser = computed(() => store.getters['auth/user']);
    const isAdmin = computed(() => store.getters['auth/isAdmin']);

    const canEdit = computed(() => {
      if (!booking.value) return false;

      // Can edit if admin or if user is the requester and booking is still pending
      return isAdmin.value || (booking.value.user_id === currentUser.value?.id && booking.value.status === 'Pending');
    });

    const canComplete = computed(() => {
      if (!booking.value) return false;

      // Can complete if approved and user is requester or admin
      return booking.value.status === 'Approved' && (booking.value.user_id === currentUser.value?.id || isAdmin.value);
    });

    const canCancel = computed(() => {
      if (!booking.value) return false;

      // Can cancel if pending or approved and user is requester or admin
      return ['Pending', 'Approved'].includes(booking.value.status) && (booking.value.user_id === currentUser.value?.id || isAdmin.value);
    });

    // Methods
    const fetchBooking = async () => {
      loading.value = true;

      try {
        const response = await store.dispatch('bookings/fetchBooking', bookingId);
        booking.value = response;
      } catch (error) {
        console.error('Error fetching booking:', error);
        store.dispatch('setError', 'Failed to fetch booking details');
        booking.value = null;
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (dateString) => {
      return moment(dateString).format('MMM D, YYYY h:mm A');
    };

    const formatDateRange = (startDate, endDate) => {
      return `${moment(startDate).format('MMM D, YYYY')} - ${moment(endDate).format('MMM D, YYYY')}`;
    };

    const confirmCancel = () => {
      showCancelDialog.value = true;
    };

    const cancelBooking = async () => {
      try {
        await store.dispatch('bookings/cancelBooking', bookingId);
        showCancelDialog.value = false;

        // Refresh the booking details
        fetchBooking();

        // Show success message
        store.dispatch('setSuccessMessage', 'Booking cancelled successfully');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        store.dispatch('setError', 'Failed to cancel booking');
      }
    };

    const completeBooking = async () => {
      try {
        await store.dispatch('bookings/completeBooking', bookingId);

        // Refresh the booking details
        fetchBooking();

        // Show success message
        store.dispatch('setSuccessMessage', 'Booking marked as completed');
      } catch (error) {
        console.error('Error completing booking:', error);
        store.dispatch('setError', 'Failed to mark booking as completed');
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      fetchBooking();
    });

    return {
      loading,
      booking,
      showCancelDialog,
      canEdit,
      canComplete,
      canCancel,
      formatDate,
      formatDateRange,
      confirmCancel,
      cancelBooking,
      completeBooking,
    };
  },
};
</script>


  <!-- src/views/bookings/BookingDetail.vue -->
