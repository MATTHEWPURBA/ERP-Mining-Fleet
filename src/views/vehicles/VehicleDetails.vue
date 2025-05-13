<template>
    <div>
      <PageHeader 
        :title="vehicle ? `Vehicle: ${vehicle.registration_no}` : 'Vehicle Details'"
        :subtitle="vehicle ? `${vehicle.vehicleType.name} at ${vehicle.location.name}` : 'Loading...'"
      >
        <template #actions>
          <div class="space-x-2">
            <router-link 
              to="/vehicles" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span class="material-icons -ml-1 mr-2 text-sm">arrow_back</span>
              Back to List
            </router-link>
            
            <router-link 
              v-if="isAdmin && vehicle"
              :to="`/vehicles/${vehicle.id}/edit`"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span class="material-icons -ml-1 mr-2 text-sm">edit</span>
              Edit
            </router-link>
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
        
        <!-- Vehicle details when loaded -->
        <div v-else-if="vehicle" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Main vehicle details -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Vehicle Information
              </h3>
              <span :class="[
                'px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full',
                vehicle.status === 'Available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                vehicle.status === 'Booked' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              ]">
                {{ vehicle.status }}
              </span>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Registration Number
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ vehicle.registration_no }}
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Vehicle Type
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ vehicle.vehicleType.name }}
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Capacity
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ vehicle.vehicleType.capacity }} passengers
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Location
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ vehicle.location.name }}
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Ownership
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                    <span v-if="vehicle.is_rented" class="text-yellow-600 dark:text-yellow-400 flex items-center">
                      <span class="material-icons text-sm mr-1">check</span> Rented
                    </span>
                    <span v-else class="text-green-600 dark:text-green-400 flex items-center">
                      <span class="material-icons text-sm mr-1">check</span> Owned
                    </span>
                  </dd>
                </div>
                
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ vehicle.vehicleType.description || 'No description available' }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <!-- Vehicle stats -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Vehicle Stats
              </h3>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6">
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <span class="material-icons text-blue-500 mr-1">event</span>
                    Total Bookings
                  </dt>
                  <dd class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {{ vehicleStats.totalBookings || '0' }}
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <span class="material-icons text-red-500 mr-1">build</span>
                    Maintenance Records
                  </dt>
                  <dd class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {{ vehicleStats.totalMaintenance || '0' }}
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <span class="material-icons text-green-500 mr-1">local_gas_station</span>
                    Fuel Records
                  </dt>
                  <dd class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {{ vehicleStats.totalFuelLogs || '0' }}
                  </dd>
                </div>
                
                <div v-if="vehicleStats.lastMaintenance">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Maintenance
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ formatDate(vehicleStats.lastMaintenance) }}
                  </dd>
                </div>
                
                <div v-if="vehicleStats.nextMaintenance">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Next Scheduled Maintenance
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ formatDate(vehicleStats.nextMaintenance) }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <!-- Quick links -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Quick Links
              </h3>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700">
              <div class="divide-y divide-gray-200 dark:divide-gray-700">
                <div class="px-4 py-4 sm:px-6">
                  <router-link 
                    :to="`/bookings?vehicle_id=${vehicle.id}`"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                  >
                    <span class="material-icons mr-2">event</span>
                    View Bookings
                  </router-link>
                </div>
                
                <div class="px-4 py-4 sm:px-6">
                  <router-link 
                    :to="`/maintenance?vehicle_id=${vehicle.id}`"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                  >
                    <span class="material-icons mr-2">build</span>
                    View Maintenance History
                  </router-link>
                </div>
                
                <div class="px-4 py-4 sm:px-6">
                  <router-link 
                    :to="`/fuel-logs?vehicle_id=${vehicle.id}`"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                  >
                    <span class="material-icons mr-2">local_gas_station</span>
                    View Fuel Logs
                  </router-link>
                </div>
                
                <div class="px-4 py-4 sm:px-6">
                  <router-link 
                    :to="`/bookings/create`"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                  >
                    <span class="material-icons mr-2">add_circle</span>
                    Book This Vehicle
                  </router-link>
                </div>
                
                <div v-if="isAdmin" class="px-4 py-4 sm:px-6">
                  <router-link 
                    :to="`/maintenance/create?vehicle_id=${vehicle.id}`"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                  >
                    <span class="material-icons mr-2">add_circle</span>
                    Add Maintenance Record
                  </router-link>
                </div>
                
                <div class="px-4 py-4 sm:px-6">
                  <router-link 
                    :to="`/fuel-logs/create?vehicle_id=${vehicle.id}`"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                  >
                    <span class="material-icons mr-2">add_circle</span>
                    Add Fuel Log
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No vehicle found error state -->
        <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div class="text-center">
            <span class="material-icons text-4xl text-gray-400 dark:text-gray-500">search_off</span>
            <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Vehicle not found</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">The vehicle you are looking for does not exist or you don't have permission to view it.</p>
            <div class="mt-6">
              <router-link to="/vehicles" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Go back to vehicles
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Tabs for related data -->
        <div v-if="vehicle" class="mt-6">
          <div class="sm:hidden">
            <label for="tabs" class="sr-only">Select a tab</label>
            <select 
              id="tabs" 
              v-model="activeTab" 
              class="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="bookings">Bookings</option>
              <option value="maintenance">Maintenance</option>
              <option value="fuel-logs">Fuel Logs</option>
            </select>
          </div>
          
          <div class="hidden sm:block">
            <div class="border-b border-gray-200 dark:border-gray-700">
              <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button 
                  @click="activeTab = 'bookings'"
                  :class="[
                    activeTab === 'bookings'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                  ]"
                >
                  Bookings
                </button>
                
                <button 
                  @click="activeTab = 'maintenance'"
                  :class="[
                    activeTab === 'maintenance'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                  ]"
                >
                  Maintenance
                </button>
                
                <button 
                  @click="activeTab = 'fuel-logs'"
                  :class="[
                    activeTab === 'fuel-logs'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                  ]"
                >
                  Fuel Logs
                </button>
              </nav>
            </div>
          </div>
          
          <!-- Tab content -->
          <div class="mt-6">
            <!-- Bookings tab -->
            <div v-if="activeTab === 'bookings'" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Recent Bookings
                </h3>
                <router-link 
                  :to="`/bookings?vehicle_id=${vehicle.id}`"
                  class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  View All
                </router-link>
              </div>
              
              <div class="border-t border-gray-200 dark:border-gray-700">
                <div v-if="loadingBookings" class="p-4 text-center">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
                  <p class="mt-2 text-sm text-gray-500">Loading bookings...</p>
                </div>
                
                <div v-else-if="vehicleBookings.length === 0" class="p-6 text-center">
                  <p class="text-gray-500 dark:text-gray-400">No bookings found for this vehicle</p>
                </div>
                
                <div v-else class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          User
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
                      <tr v-for="booking in vehicleBookings" :key="booking.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {{ booking.id }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {{ booking.user.name }}
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
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="[
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
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
              </div>
            </div>
            
            <!-- Maintenance tab -->
            <div v-if="activeTab === 'maintenance'" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Maintenance History
                </h3>
                <router-link 
                  :to="`/maintenance?vehicle_id=${vehicle.id}`"
                  class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  View All
                </router-link>
              </div>
              
              <div class="border-t border-gray-200 dark:border-gray-700">
                <div v-if="loadingMaintenance" class="p-4 text-center">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
                  <p class="mt-2 text-sm text-gray-500">Loading maintenance records...</p>
                </div>
                
                <div v-else-if="vehicleMaintenance.length === 0" class="p-6 text-center">
                  <p class="text-gray-500 dark:text-gray-400">No maintenance records found for this vehicle</p>
                </div>
                
                <div v-else class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Cost
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Next Date
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr v-for="maintenance in vehicleMaintenance" :key="maintenance.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {{ maintenance.id }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="[
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            maintenance.type === 'Scheduled' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          ]">
                            {{ maintenance.type }}
                          </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {{ maintenance.description }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {{ formatDate(maintenance.date) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${{ maintenance.cost.toFixed(2) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {{ maintenance.next_date ? formatDate(maintenance.next_date) : 'N/A' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <!-- Fuel Logs tab -->
            <div v-if="activeTab === 'fuel-logs'" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Fuel Logs
                </h3>
                <router-link 
                  :to="`/fuel-logs?vehicle_id=${vehicle.id}`"
                  class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  View All
                </router-link>
              </div>
              
              <div class="border-t border-gray-200 dark:border-gray-700">
                <div v-if="loadingFuelLogs" class="p-4 text-center">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
                  <p class="mt-2 text-sm text-gray-500">Loading fuel logs...</p>
                </div>
                
                <div v-else-if="vehicleFuelLogs.length === 0" class="p-6 text-center">
                  <p class="text-gray-500 dark:text-gray-400">No fuel logs found for this vehicle</p>
                </div>
                
                <div v-else class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Liters
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Cost
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Odometer
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Recorded By
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr v-for="fuelLog in vehicleFuelLogs" :key="fuelLog.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {{ fuelLog.id }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {{ formatDate(fuelLog.date) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {{ fuelLog.liters.toFixed(2) }} L
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${{ fuelLog.cost.toFixed(2) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {{ fuelLog.odometer }} km
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {{ fuelLog.creator.name }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router';
  import moment from 'moment';
  import PageHeader from '@/components/common/PageHeader.vue';
  
  export default {
    name: 'VehicleDetails',
    components: {
      PageHeader
    },
    setup() {
      const store = useStore();
      const route = useRoute();
      
      // Get vehicle ID from route params
      const vehicleId = route.params.id;
      
      // Reactive state
      const loading = ref(true);
      const loadingBookings = ref(false);
      const loadingMaintenance = ref(false);
      const loadingFuelLogs = ref(false);
      const vehicle = ref(null);
      const vehicleBookings = ref([]);
      const vehicleMaintenance = ref([]);
      const vehicleFuelLogs = ref([]);
      const activeTab = ref('bookings');
      
      // Computed properties
      const isAdmin = computed(() => store.getters['auth/isAdmin']);
      
      const vehicleStats = computed(() => {
        return {
          totalBookings: vehicleBookings.value.length,
          totalMaintenance: vehicleMaintenance.value.length,
          totalFuelLogs: vehicleFuelLogs.value.length,
          lastMaintenance: vehicleMaintenance.value.length > 0 ? 
            vehicleMaintenance.value[0].date : null,
          nextMaintenance: vehicleMaintenance.value
            .filter(m => m.next_date)
            .sort((a, b) => new Date(a.next_date) - new Date(b.next_date))
            .map(m => m.next_date)[0] || null
        };
      });
      
      // Methods
      const fetchVehicle = async () => {
        loading.value = true;
        
        try {
          const response = await store.dispatch('vehicles/fetchVehicle', vehicleId);
          vehicle.value = response;
        } catch (error) {
          console.error('Error fetching vehicle:', error);
          store.dispatch('setError', 'Failed to fetch vehicle details');
          vehicle.value = null;
        } finally {
          loading.value = false;
        }
      };
      
      const fetchVehicleBookings = async () => {
        if (!vehicle.value) return;
        
        loadingBookings.value = true;
        
        try {
          const response = await store.dispatch('vehicles/fetchVehicleBookings', vehicleId);
          vehicleBookings.value = response;
        } catch (error) {
          console.error('Error fetching vehicle bookings:', error);
          store.dispatch('setError', 'Failed to fetch vehicle bookings');
        } finally {
          loadingBookings.value = false;
        }
      };
      
      const fetchVehicleMaintenance = async () => {
        if (!vehicle.value) return;
        
        loadingMaintenance.value = true;
        
        try {
          const response = await store.dispatch('vehicles/fetchVehicleMaintenance', vehicleId);
          vehicleMaintenance.value = response;
        } catch (error) {
          console.error('Error fetching vehicle maintenance:', error);
          store.dispatch('setError', 'Failed to fetch vehicle maintenance');
        } finally {
          loadingMaintenance.value = false;
        }
      };
      
      const fetchVehicleFuelLogs = async () => {
        if (!vehicle.value) return;
        
        loadingFuelLogs.value = true;
        
        try {
          const response = await store.dispatch('vehicles/fetchVehicleFuelLogs', vehicleId);
          vehicleFuelLogs.value = response;
        } catch (error) {
          console.error('Error fetching vehicle fuel logs:', error);
          store.dispatch('setError', 'Failed to fetch vehicle fuel logs');
        } finally {
          loadingFuelLogs.value = false;
        }
      };
      
      const formatDate = (dateString) => {
        return moment(dateString).format('MMM D, YYYY');
      };
      
      // Lifecycle hooks
      onMounted(() => {
        fetchVehicle().then(() => {
          // Fetch related data once vehicle is loaded
          fetchVehicleBookings();
          fetchVehicleMaintenance();
          fetchVehicleFuelLogs();
        });
      });
      
      return {
        loading,
        loadingBookings,
        loadingMaintenance,
        loadingFuelLogs,
        vehicle,
        vehicleBookings,
        vehicleMaintenance,
        vehicleFuelLogs,
        activeTab,
        isAdmin,
        vehicleStats,
        formatDate
      };
    }
  };
  </script>