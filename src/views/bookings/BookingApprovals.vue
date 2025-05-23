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
            <!-- Only show approve/reject buttons if user can approve this item -->
            <button 
              v-if="item.status === 'Pending' && canApprove(item)" 
              @click.stop="openApprovalDialog(item, 'approve')" 
              class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300" 
              title="Approve booking request"
            >
              <span class="material-icons text-sm">check_circle</span>
            </button>

            <button 
              v-if="item.status === 'Pending' && canApprove(item)" 
              @click.stop="openApprovalDialog(item, 'reject')" 
              class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300" 
              title="Reject booking request"
            >
              <span class="material-icons text-sm">cancel</span>
            </button>

            <!-- Show waiting message if approval is not yet eligible -->
            <span 
              v-if="item.status === 'Pending' && !canApprove(item)" 
              class="text-gray-500 dark:text-gray-400 text-xs italic"
              title="Waiting for previous approval level"
            >
              Awaiting previous level
            </span>

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
    const loading = ref(true); 
    const error = ref(null);
    const approvals = ref([]);
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

    // Get current user info from store
    const currentUser = computed(() => store.getters['auth/user'] || {});

    /**
     * Determines if the current user can approve a specific booking
     * Implements sequential approval workflow logic
     */
    const canApprove = (approval) => {
      if (!approval || !currentUser.value) return false;

      // If user is explicitly assigned as the approver for this approval
      if (approval.approver_id === currentUser.value.id) {
        // For level 1 approvers, they can always approve if assigned
        if (approval.level === 1) {
          return true;
        }
        
        // For level 2+ approvers, they need to verify previous levels are approved
        return hasAllPreviousLevelsApproved(approval);
      }

      // Admin role is not specifically handled as they should only see
      // approvals explicitly assigned to them or ones that are ready for their level
      return false;
    };

    /**
     * Checks if all previous approval levels for a booking have been approved
     */
    const hasAllPreviousLevelsApproved = (approval) => {
      if (!approval || !approval.booking_id || !Array.isArray(approvals.value)) {
        return false;
      }

      const currentLevel = approval.level;
      if (currentLevel <= 1) return true; // Level 1 has no previous levels

      // Find all approvals for this booking
      const bookingApprovals = approvals.value.filter(a => a.booking_id === approval.booking_id);
      
      // Check all previous levels
      for (let level = 1; level < currentLevel; level++) {
        const previousLevelApproval = bookingApprovals.find(a => a.level === level);
        
        // If previous level doesn't exist or isn't approved, then false
        if (!previousLevelApproval || previousLevelApproval.status !== 'Approved') {
          return false;
        }
      }
      
      return true;
    };

    /**
     * Filters approvals based on the selected tab and ensures they're accessible
     * to the current user based on role and sequential approval workflow
     */
    const filteredApprovals = computed(() => {
      if (!approvals.value || !Array.isArray(approvals.value)) {
        return [];
      }

      let result = approvals.value;

      // First, filter by the active tab
      if (activeTab.value !== 'all') {
        result = result.filter(
          (approval) => approval && approval.status && approval.status.toLowerCase() === activeTab.value
        );
      }

      // For administrators, only show approvals that are either:
      // 1. Directly assigned to them, or
      // 2. Ready for them to approve (all previous levels are approved)
      if (currentUser.value.role === 'Administrator') {
        result = result.filter(approval => {
          // Show if directly assigned to this admin
          if (approval.approver_id === currentUser.value.id) {
            return true;
          }
          
          // Show if it's a level 2+ approval and all previous levels are approved
          if (approval.level > 1 && approval.status === 'Pending') {
            return hasAllPreviousLevelsApproved(approval);
          }
          
          // Hide all other approvals
          return false;
        });
      } 
      // For approvers, only show approvals assigned to them
      else if (currentUser.value.role === 'Approver') {
        result = result.filter(approval => approval.approver_id === currentUser.value.id);
      }

      return result;
    });

    const emptyStateMessage = computed(() => {
      if (activeTab.value === 'pending') {
        return 'There are no pending approval requests for you at this time.';
      } else if (activeTab.value === 'approved') {
        return 'There are no approved requests matching your criteria.';
      } else if (activeTab.value === 'rejected') {
        return 'There are no rejected requests matching your criteria.';
      } else {
        return 'There are no approval requests matching your criteria.';
      }
    });

    /**
     * Fetches approval requests from the API
     * For correct sequential workflow functionality, we need to fetch ALL approvals
     * but will filter the display based on the user's role and the sequential logic
     */
    const fetchApprovals = async () => {
      loading.value = true;
      error.value = null;

      try {
        // Fetch all approvals - we need the complete set to determine sequential approval status
        const response = await store.dispatch('bookingApprovals/fetchApprovals');

        // Validate response structure
        if (!response || !Array.isArray(response)) {
          throw new Error('Received invalid data format from server');
        }

        // Store the full list of approvals for reference and processing
        approvals.value = response;

        // Count approvals relevant to the current user
        const userApprovals = filterApprovalsForCurrentUser(response);
        counts.value = {
          pending: userApprovals.filter((a) => a && a.status === 'Pending').length,
          approved: userApprovals.filter((a) => a && a.status === 'Approved').length,
          rejected: userApprovals.filter((a) => a && a.status === 'Rejected').length,
          all: userApprovals.length,
        };
      } catch (err) {
        console.error('Error in fetchApprovals:', err);
        error.value = 'Failed to load approval requests. Please try again.';
        approvals.value = [];
      } finally {
        loading.value = false;
      }
    };

    /**
     * Filters approvals to only show those relevant to the current user
     * This is used for counting approvals, to ensure the counts reflect
     * only those approvals that will be displayed to the user
     */
    const filterApprovalsForCurrentUser = (allApprovals) => {
      if (!Array.isArray(allApprovals) || !currentUser.value) {
        return [];
      }

      // For administrators, only include:
      // 1. Directly assigned approvals
      // 2. Level 2+ approvals where all previous levels are approved
      if (currentUser.value.role === 'Administrator') {
        return allApprovals.filter(approval => {
          // Directly assigned
          if (approval.approver_id === currentUser.value.id) {
            return true;
          }
          
          // Level 2+ with previous levels approved
          if (approval.level > 1 && approval.status === 'Pending') {
            // Need to check if all previous levels are approved
            // Find all approvals for this booking
            const bookingApprovals = allApprovals.filter(a => a.booking_id === approval.booking_id);
            
            // Check previous levels
            for (let level = 1; level < approval.level; level++) {
              const previousApproval = bookingApprovals.find(a => a.level === level);
              if (!previousApproval || previousApproval.status !== 'Approved') {
                return false;
              }
            }
            
            return true;
          }
          
          return false;
        });
      } 
      // For approvers, only show approvals assigned to them
      else if (currentUser.value.role === 'Approver') {
        return allApprovals.filter(approval => approval.approver_id === currentUser.value.id);
      }
      
      // For other roles, show nothing
      return [];
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
      if (approval && approval.booking && approval.booking.id) {
        router.push(`/bookings/${approval.booking.id}`);
      } else {
        store.dispatch('setError', 'Unable to view booking details - Invalid booking data');
      }
    };

    const openApprovalDialog = (approval, action) => {
      // Verify approval eligibility
      if (!canApprove(approval)) {
        store.dispatch('setError', 'You cannot process this approval at this time. Previous approval levels must be completed first.');
        return;
      }

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

      // Final verification before submission
      if (!canApprove(selectedApproval.value)) {
        store.dispatch('setError', 'You cannot process this approval at this time. Previous approval levels must be completed first.');
        showDialog.value = false;
        return;
      }

      processingApproval.value = true;

      try {
        const approvalId = selectedApproval.value.id;
        const comments = approvalComments.value;

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

        // Refresh the full list of approvals
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

    // Initialize component
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
      submitApprovalDecision,
      canApprove,
      hasAllPreviousLevelsApproved
    };
  },
};
</script>