<template>
    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white dark:bg-gray-800">
      <!-- Table filter and search controls -->
      <div v-if="showControls" class="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700">
        <!-- Search input -->
        <div class="w-full sm:w-64">
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="material-icons text-gray-400 text-lg">search</span>
            </div>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search..."
              class="block w-full pl-10 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @input="onSearch"
            />
          </div>
        </div>
        
        <!-- Filter dropdown if provided -->
        <div v-if="filters && filters.length > 0" class="flex items-center space-x-4">
          <div v-for="(filter, index) in filters" :key="index" class="relative">
            <select
              :value="selectedFilters[filter.name] || ''"
              @change="onFilterChange(filter.name, $event)"
              class="block w-full py-2 pl-3 pr-10 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">{{ filter.placeholder || 'All' }}</option>
              <option v-for="option in filter.options" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- Custom actions slot -->
        <div v-if="$slots.actions">
          <slot name="actions"></slot>
        </div>
      </div>
      
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                v-for="(column, index) in visibleColumns"
                :key="index"
                scope="col"
                :class="[
                  'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider',
                  column.sortable ? 'cursor-pointer' : '',
                  sortBy === column.key ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-300'
                ]"
                @click="column.sortable ? sort(column.key) : null"
              >
                <div class="flex items-center">
                  {{ column.label }}
                  <span
                    v-if="column.sortable"
                    class="ml-1 material-icons text-sm"
                    :class="{ 'opacity-0': sortBy !== column.key }"
                  >
                    {{ sortBy === column.key && sortDirection === 'desc' ? 'arrow_drop_down' : 'arrow_drop_up' }}
                  </span>
                </div>
              </th>
              <th v-if="$slots.actions" scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            <tr v-if="loading" class="animate-pulse">
              <td :colspan="visibleColumns.length + ($slots.actions ? 1 : 0)" class="px-6 py-4">
                <div class="flex justify-center">
                  <div class="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </td>
            </tr>
            <tr v-else-if="processedData.length === 0" class="text-center">
              <td :colspan="visibleColumns.length + ($slots.actions ? 1 : 0)" class="px-6 py-4 text-gray-500 dark:text-gray-400">
                {{ emptyMessage }}
              </td>
            </tr>
            <tr 
              v-for="(item, rowIndex) in processedData" 
              :key="rowIndex"
              :class="[
                rowClickable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : '',
                getRowClass ? getRowClass(item) : ''
              ]"
              @click="rowClickable ? onRowClick(item) : null"
            >
              <td
                v-for="(column, colIndex) in visibleColumns"
                :key="colIndex"
                class="px-6 py-4 whitespace-nowrap"
                :class="[
                  column.class || '',
                  typeof column.tdClass === 'function' ? column.tdClass(item) : column.tdClass || ''
                ]"
              >
                <!-- Use custom formatter if provided, otherwise just render the value -->
                <slot 
                  :name="`cell(${column.key})`" 
                  :value="item[column.key]" 
                  :item="item" 
                  :columnDef="column"
                >
                  <template v-if="column.formatter">
                    <span v-html="column.formatter(item[column.key], item)"></span>
                  </template>
                  <template v-else>
                    {{ item[column.key] }}
                  </template>
                </slot>
              </td>
              <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <slot name="actions" :item="item" :index="rowIndex"></slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination controls -->
      <div v-if="pagination" class="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            :disabled="pagination.currentPage === 1"
            @click="changePage(pagination.currentPage - 1)"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            :disabled="pagination.currentPage === pagination.totalPages"
            @click="changePage(pagination.currentPage + 1)"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing
              <span class="font-medium">{{ paginationStart }}</span>
              to
              <span class="font-medium">{{ paginationEnd }}</span>
              of
              <span class="font-medium">{{ pagination.totalItems }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                :disabled="pagination.currentPage === 1"
                @click="changePage(pagination.currentPage - 1)"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <span class="sr-only">Previous</span>
                <span class="material-icons text-sm">chevron_left</span>
              </button>
              
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="changePage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === pagination.currentPage
                    ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-300 z-10'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
              
              <button
                :disabled="pagination.currentPage === pagination.totalPages"
                @click="changePage(pagination.currentPage + 1)"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <span class="sr-only">Next</span>
                <span class="material-icons text-sm">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  
  export default {
    name: 'DataTable',
    props: {
      columns: {
        type: Array,
        required: true
      },
      data: {
        type: Array,
        required: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      pagination: {
        type: Object,
        default: null
      },
      filters: {
        type: Array,
        default: null
      },
      showControls: {
        type: Boolean,
        default: true
      },
      rowClickable: {
        type: Boolean,
        default: false
      },
      getRowClass: {
        type: Function,
        default: null
      },
      emptyMessage: {
        type: String,
        default: 'No data available'
      }
    },
    emits: ['page-change', 'row-click', 'sort', 'search', 'filter'],
    setup(props, { emit }) {
      // Reactive state
      const sortBy = ref('');
      const sortDirection = ref('asc');
      const searchQuery = ref('');
      const selectedFilters = ref({});
      
      // Computed properties
      const visibleColumns = computed(() => {
        return props.columns.filter(column => !column.hidden);
      });
      
      const processedData = computed(() => {
        let result = [...props.data];
        
        // Apply search if set
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          result = result.filter(item => {
            return visibleColumns.value.some(column => {
              const value = item[column.key];
              return value && String(value).toLowerCase().includes(query);
            });
          });
        }
        
        // Apply sorting if set
        if (sortBy.value) {
          result.sort((a, b) => {
            let aVal = a[sortBy.value];
            let bVal = b[sortBy.value];
            
            // Handle null values
            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;
            
            // Convert to strings for comparison
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
            
            // Compare
            if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1;
            return 0;
          });
        }
        
        return result;
      });
      
      const displayedPages = computed(() => {
        if (!props.pagination) return [];
        
        const { currentPage, totalPages } = props.pagination;
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
          return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        
        let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let end = start + maxPagesToShow - 1;
        
        if (end > totalPages) {
          end = totalPages;
          start = Math.max(1, end - maxPagesToShow + 1);
        }
        
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      });
      
      const paginationStart = computed(() => {
        if (!props.pagination) return 0;
        
        const { currentPage, itemsPerPage, totalItems } = props.pagination;
        return Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
      });
      
      const paginationEnd = computed(() => {
        if (!props.pagination) return 0;
        
        const { currentPage, itemsPerPage, totalItems } = props.pagination;
        return Math.min(currentPage * itemsPerPage, totalItems);
      });
      
      // Methods
      const sort = (key) => {
        if (sortBy.value === key) {
          // Toggle direction if already sorting by this key
          sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
        } else {
          // New sort key, default to ascending
          sortBy.value = key;
          sortDirection.value = 'asc';
        }
        
        emit('sort', { key, direction: sortDirection.value });
      };
      
      const onSearch = () => {
        emit('search', searchQuery.value);
      };
      
      const onFilterChange = (filterName, event) => {
        const value = event.target.value;
        selectedFilters.value = {
          ...selectedFilters.value,
          [filterName]: value
        };
        
        emit('filter', selectedFilters.value);
      };
      
      const changePage = (page) => {
        emit('page-change', page);
      };
      
      const onRowClick = (item) => {
        emit('row-click', item);
      };
      
      // Watchers
      watch(() => props.data, () => {
        // Reset sort and search when data changes
        if (props.data.length === 0) {
          sortBy.value = '';
          sortDirection.value = 'asc';
        }
      });
      
      return {
        sortBy,
        sortDirection,
        searchQuery,
        selectedFilters,
        visibleColumns,
        processedData,
        displayedPages,
        paginationStart,
        paginationEnd,
        sort,
        onSearch,
        onFilterChange,
        changePage,
        onRowClick
      };
    }
  };
  </script>


<!-- frontend/src/components/common/DataTable.vue -->