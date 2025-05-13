<template>
    <div>
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of fleet operations and key metrics"
      />
      
      <div class="mt-6">
        <!-- Loading state -->
        <div v-if="loading" class="animate-pulse">
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-3"></div>
                <div class="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Dashboard content when data is loaded -->
        <div v-else>
          <!-- Stat cards -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Vehicles -->
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <span class="material-icons text-blue-600 dark:text-blue-500 text-2xl">directions_car</span>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Vehicles</dt>
                      <dd>
                        <div class="text-lg font-medium text-gray-900 dark:text-white">{{ stats.vehicle_count.total }}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                <div class="text-sm flex items-center justify-between">
                  <div>
                    <span class="font-medium text-green-600 dark:text-green-400">{{ stats.vehicle_count.available }}</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-1">Available</span>
                  </div>
                  <div>
                    <span class="font-medium text-yellow-600 dark:text-yellow-400">{{ stats.vehicle_count.booked }}</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-1">Booked</span>
                  </div>
                  <div>
                    <span class="font-medium text-red-600 dark:text-red-400">{{ stats.vehicle_count.maintenance }}</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-1">Maintenance</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Bookings -->
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <span class="material-icons text-green-600 dark:text-green-500 text-2xl">event</span>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Bookings</dt>
                      <dd>
                        <div class="text-lg font-medium text-gray-900 dark:text-white">{{ stats.booking_count.total }}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                <div class="text-sm flex items-center justify-between">
                  <div>
                    <span class="font-medium text-yellow-600 dark:text-yellow-400">{{ stats.booking_count.pending }}</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-1">Pending</span>
                  </div>
                  <div>
                    <span class="font-medium text-green-600 dark:text-green-400">{{ stats.booking_count.approved }}</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-1">Approved</span>
                  </div>
                  <div>
                    <span class="font-medium text-red-600 dark:text-red-400">{{ stats.booking_count.rejected }}</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-1">Rejected</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Pending Approvals -->
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <span class="material-icons text-orange-600 dark:text-orange-500 text-2xl">fact_check</span>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Pending Approvals</dt>
                      <dd>
                        <div class="text-lg font-medium text-gray-900 dark:text-white">{{ stats.pending_approvals }}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                <div class="text-sm">
                  <router-link to="/approvals" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                    View all approvals
                  </router-link>
                </div>
              </div>
            </div>
            
            <!-- Maintenance -->
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <span class="material-icons text-red-600 dark:text-red-500 text-2xl">build</span>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Upcoming Maintenance</dt>
                      <dd>
                        <div class="text-lg font-medium text-gray-900 dark:text-white">{{ stats.upcoming_maintenance }}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                <div class="text-sm">
                  <router-link to="/maintenance" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                    View maintenance schedule
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Charts and data visualization -->
          <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <!-- Vehicle Status Distribution Chart -->
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Vehicle Status Distribution</h3>
              <div class="h-64 mt-4">
                <PieChart 
                  :chart-data="vehicleStatusData" 
                  :options="{ responsive: true, maintainAspectRatio: false }"
                />
              </div>
            </div>
            
            <!-- Vehicle Type Distribution Chart -->
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Vehicle Type Distribution</h3>
              <div class="h-64 mt-4">
                <BarChart 
                  :chart-data="vehicleTypeData" 
                  :options="{ responsive: true, maintainAspectRatio: false }"
                />
              </div>
            </div>
          </div>
          
          <!-- Recent bookings table -->
          <div class="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Bookings</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      End Date
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="booking in recentBookings" :key="booking.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ booking.user.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ booking.vehicle.registration_no }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ booking.purpose }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(booking.start_date) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(booking.end_date) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        booking.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                        booking.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      ]">
                        {{ booking.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <router-link 
                        :to="`/bookings/${booking.id}`" 
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        View
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-4 text-right">
              <router-link to="/bookings" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                View all bookings
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import moment from 'moment';
  import PageHeader from '@/components/common/PageHeader.vue';
  import { Pie as PieChart, Bar as BarChart } from 'vue-chartjs';
  import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
  
  // Register Chart.js components
  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);
  
  export default {
    name: 'Dashboard',
    components: {
      PageHeader,
      PieChart,
      BarChart
    },
    setup() {
      const store = useStore();
      
      // Reactive state
      const loading = ref(true);
      const stats = ref({
        vehicle_count: { total: 0, available: 0, booked: 0, maintenance: 0 },
        booking_count: { total: 0, pending: 0, approved: 0, rejected: 0 },
        pending_approvals: 0,
        upcoming_maintenance: 0
      });
      const vehicleStatusDistribution = ref([]);
      const vehicleTypeDistribution = ref([]);
      const recentBookings = ref([]);
      
      // Computed properties for charts
      const vehicleStatusData = computed(() => {
        return {
          labels: vehicleStatusDistribution.value.map(item => item.status),
          datasets: [
            {
              label: 'Vehicle Status',
              data: vehicleStatusDistribution.value.map(item => item.count),
              backgroundColor: [
                'rgba(34, 197, 94, 0.5)', // Green for Available
                'rgba(234, 179, 8, 0.5)',  // Yellow for Booked
                'rgba(239, 68, 68, 0.5)'   // Red for Maintenance
              ],
              borderColor: [
                'rgba(34, 197, 94, 1)',
                'rgba(234, 179, 8, 1)',
                'rgba(239, 68, 68, 1)'
              ],
              borderWidth: 1
            }
          ]
        };
      });
      
      const vehicleTypeData = computed(() => {
        return {
          labels: vehicleTypeDistribution.value.map(item => item.type),
          datasets: [
            {
              label: 'Vehicle Count',
              data: vehicleTypeDistribution.value.map(item => item.count),
              backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1
            }
          ]
        };
      });
      
      // Methods
      const fetchDashboardData = async () => {
        loading.value = true;
        
        try {
          // Fetch dashboard statistics
          const statsResponse = await store.dispatch('dashboard/fetchStats');
          stats.value = statsResponse;
          
          // Fetch vehicle distribution data
          const distributionResponse = await store.dispatch('dashboard/fetchVehicleDistribution');
          vehicleStatusDistribution.value = distributionResponse.vehicle_status;
          vehicleTypeDistribution.value = distributionResponse.vehicle_types;
          
          // Fetch recent bookings
          const bookingsResponse = await store.dispatch('dashboard/fetchRecentBookings');
          recentBookings.value = bookingsResponse;
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          store.dispatch('setError', 'Error loading dashboard data');
        } finally {
          loading.value = false;
        }
      };
      
      const formatDate = (dateString) => {
        return moment(dateString).format('MMM D, YYYY h:mm A');
      };
      
      // Lifecycle hooks
      onMounted(() => {
        fetchDashboardData();
      });
      
      return {
        loading,
        stats,
        vehicleStatusDistribution,
        vehicleTypeDistribution,
        recentBookings,
        vehicleStatusData,
        vehicleTypeData,
        formatDate
      };
    }
  };
  </script>