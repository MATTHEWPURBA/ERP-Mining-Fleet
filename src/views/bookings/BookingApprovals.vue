<template>
  <div>
    <PageHeader title="Booking Approvals" subtitle="Review and manage vehicle booking approval requests" />

    <div class="mt-6">
      <!-- Loading state -->
      <div v-if="loading" class="animate-pulse space-y-4">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900 p-4 rounded-md">
        <p class="text-red-700 dark:text-red-300">{{ error }}</p>
        <button @click="fetchApprovals" class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Retry</button>
      </div>

      <!-- Tab navigation for approval status filters -->
      <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul class="flex flex-wrap -mb-px">
          <li class="mr-2" v-for="tab in tabs" :key="tab.value">
            <button @click="activeTab = tab.value" :class="['inline-block py-2 px-4 text-sm font-medium', activeTab === tab.value ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300']">
              {{ tab.label }}
              <span v-if="tab.count > 0" class="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                {{ tab.count }}
              </span>
            </button>
          </li>
        </ul>
      </div>

      <!-- Approvals data table -->
      <DataTable v-if="!loading && !error && filteredApprovals.length > 0" :columns="columns" :data="filteredApprovals" :loading="loading" row-clickable @row-click="viewBookingDetails">
        <!-- Cell formatters with robust null checks -->
        <template #[`cell(booking.purpose)`]="{ item }">
          {{ item && item.booking ? item.booking.purpose || 'N/A' : 'N/A' }}
        </template>

        <template #[`cell(booking.start_date)`]="{ item }">
          {{ item && item.booking && item.booking.start_date ? formatDate(item.booking.start_date) : 'N/A' }}
        </template>

        <template #[`cell(booking.end_date)`]="{ item }">
          {{ item && item.booking && item.booking.end_date ? formatDate(item.booking.end_date) : 'N/A' }}
        </template>

        <template #[`cell(booking.user.name)`]="{ item }">
          {{ item && item.booking && item.booking.user ? item.booking.user.name || 'N/A' : 'N/A' }}
        </template>

        <template #[`cell(booking.vehicle.registration_no)`]="{ item }">
          {{ item && item.booking && item.booking.vehicle ? item.booking.vehicle.registration_no || 'N/A' : 'N/A' }}
        </template>

        <template #[`cell(status)`]="{ item }">
          <span
            v-if="item && item.status !== undefined && item.status !== null"
            :class="[
              'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
              item.status === 'Approved'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : item.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                : item.status === 'Rejected'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            ]"
          >
            {{ item.status }}
          </span>
          <span v-else>N/A</span>
        </template>

        <!-- Actions column with proper null checks -->
        <template #actions="{ item }">
          <div v-if="item" class="flex items-center space-x-2">
            <button v-if="item.status === 'Pending'" @click.stop="openApprovalDialog(item, 'approve')" class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300" title="Approve booking request">
              <span class="material-icons text-sm">check_circle</span>
            </button>

            <button v-if="item.status === 'Pending'" @click.stop="openApprovalDialog(item, 'reject')" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300" title="Reject booking request">
              <span class="material-icons text-sm">cancel</span>
            </button>

            <router-link v-if="item.booking && item.booking.id" :to="`/bookings/${item.booking.id}`" class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300" title="View booking details">
              <span class="material-icons text-sm">visibility</span>
            </router-link>
          </div>
        </template>
      </DataTable>

      <!-- Empty state when no approvals -->
      <div v-else-if="!loading && !error" class="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
        <span class="material-icons text-4xl text-gray-400 dark:text-gray-500">fact_check</span>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No approval requests found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ emptyStateMessage }}
        </p>
      </div>
    </div>

    <!-- Approval/Rejection dialog -->
    <div v-if="showDialog" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDialog = false"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10" :class="dialogAction === 'approve' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'">
                <span class="material-icons" :class="dialogAction === 'approve' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                  {{ dialogAction === 'approve' ? 'check_circle' : 'cancel' }}
                </span>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  {{ dialogAction === 'approve' ? 'Approve Booking Request' : 'Reject Booking Request' }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ dialogAction === 'approve' ? 'Are you sure you want to approve this booking request?' : 'Are you sure you want to reject this booking request?' }}
                  </p>

                  <div class="mt-4">
                    <label for="comments" class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Comments (optional) </label>
                    <textarea id="comments" v-model="approvalComments" rows="3" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="submitApprovalDecision"
              type="button"
              :class="[
                'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
                dialogAction === 'approve' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
              ]"
              :disabled="processingApproval"
            >
              <span v-if="processingApproval" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ dialogAction === 'approve' ? 'Approve' : 'Reject' }}
            </button>
            <button
              @click="showDialog = false"
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
import moment from 'moment';
import PageHeader from '@/components/common/PageHeader.vue';
import DataTable from '@/components/common/DataTable.vue';

export default {
  name: 'BookingApprovals',
  components: {
    PageHeader,
    DataTable,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    // Reactive state with initializations to prevent undefined errors
    const loading = ref(true); // Start with loading=true to prevent premature rendering
    const error = ref(null);
    const approvals = ref([]); // Initialize as empty array
    const activeTab = ref('pending');
    const showDialog = ref(false);
    const selectedApproval = ref(null);
    const dialogAction = ref('approve');
    const approvalComments = ref('');
    const processingApproval = ref(false);

    // Approval status counts for tab badges
    const counts = ref({
      pending: 0,
      approved: 0,
      rejected: 0,
      all: 0,
    });

    // Table column definitions
    const columns = [
      { key: 'booking.user.name', label: 'Requester', sortable: true },
      { key: 'booking.vehicle.registration_no', label: 'Vehicle', sortable: true },
      { key: 'booking.purpose', label: 'Purpose', sortable: true },
      { key: 'booking.start_date', label: 'Start Date', sortable: true },
      { key: 'booking.end_date', label: 'End Date', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'level', label: 'Level', sortable: true },
    ];

    // Computed properties
    const tabs = computed(() => [
      { label: 'Pending', value: 'pending', count: counts.value.pending },
      { label: 'Approved', value: 'approved', count: counts.value.approved },
      { label: 'Rejected', value: 'rejected', count: counts.value.rejected },
      { label: 'All', value: 'all', count: counts.value.all },
    ]);

    // Enhanced filteredApprovals with safety check
    const filteredApprovals = computed(() => {
      // Make sure approvals is defined and has items
      if (!approvals.value || !Array.isArray(approvals.value)) {
        return [];
      }

      if (activeTab.value === 'all') {
        return approvals.value;
      }

      // Add safety check for item.status
      return approvals.value.filter((approval) => approval && approval.status && approval.status.toLowerCase() === activeTab.value);
    });

    const emptyStateMessage = computed(() => {
      if (activeTab.value === 'pending') {
        return 'There are no pending approval requests at this time.';
      } else if (activeTab.value === 'approved') {
        return 'There are no approved requests matching your criteria.';
      } else if (activeTab.value === 'rejected') {
        return 'There are no rejected requests matching your criteria.';
      } else {
        return 'There are no approval requests matching your criteria.';
      }
    });

    // Methods
    const fetchApprovals = async () => {
      loading.value = true;
      error.value = null;

      try {
        // Fetch approvals from API through Vuex store
        const response = await store.dispatch('bookingApprovals/fetchApprovals');

        // Validate response structure
        if (!response || !Array.isArray(response)) {
          throw new Error('Received invalid data format from server');
        }

        approvals.value = response;

        // Count approvals by status
        counts.value = {
          pending: approvals.value.filter((a) => a && a.status === 'Pending').length,
          approved: approvals.value.filter((a) => a && a.status === 'Approved').length,
          rejected: approvals.value.filter((a) => a && a.status === 'Rejected').length,
          all: approvals.value.length,
        };
      } catch (err) {
        console.error('Error in fetchApprovals:', err);
        error.value = 'Failed to load approval requests. Please try again.';
        approvals.value = [];
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        return moment(dateString).format('MMM D, YYYY h:mm A');
      } catch (err) {
        console.error('Date formatting error:', err);
        return 'Invalid Date';
      }
    };

    const viewBookingDetails = (approval) => {
      // Add safety check before navigation
      if (approval && approval.booking && approval.booking.id) {
        router.push(`/bookings/${approval.booking.id}`);
      } else {
        console.error('Cannot navigate to booking details: Invalid booking ID', approval);
        // Optionally show an error message to the user
        store.dispatch('setError', 'Unable to view booking details - Invalid booking data');
      }
    };

    const openApprovalDialog = (approval, action) => {
      selectedApproval.value = approval;
      dialogAction.value = action;
      approvalComments.value = '';
      showDialog.value = true;
    };

    const submitApprovalDecision = async () => {
      if (!selectedApproval.value) {
        console.error('Cannot submit approval decision: No approval selected');
        return;
      }

      processingApproval.value = true;

      try {
        const approvalId = selectedApproval.value.id;
        const comments = approvalComments.value;

        // Use actual API calls through Vuex store actions
        if (dialogAction.value === 'approve') {
          await store.dispatch('bookingApprovals/approveBooking', {
            id: approvalId,
            data: { comments },
          });
          store.dispatch('setSuccessMessage', 'Booking request approved successfully');
        } else {
          await store.dispatch('bookingApprovals/rejectBooking', {
            id: approvalId,
            data: { comments },
          });
          store.dispatch('setSuccessMessage', 'Booking request rejected successfully');
        }

        // Refresh approvals list after successful action
        await fetchApprovals();

        showDialog.value = false;
        selectedApproval.value = null;
      } catch (err) {
        console.error('Error processing approval decision:', err);
        store.dispatch('setError', dialogAction.value === 'approve' ? 'Failed to approve booking request' : 'Failed to reject booking request');
      } finally {
        processingApproval.value = false;
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      fetchApprovals();
    });
    return {
      loading,
      error,
      approvals,
      columns,
      activeTab,
      tabs,
      filteredApprovals,
      emptyStateMessage,
      showDialog,
      selectedApproval,
      dialogAction,
      approvalComments,
      processingApproval,
      fetchApprovals,
      formatDate,
      viewBookingDetails,
      openApprovalDialog,
      submitApprovalDecision
    };
  },
};
</script>
<!-- src/views/bookings/BookingApprovals.vue -->
