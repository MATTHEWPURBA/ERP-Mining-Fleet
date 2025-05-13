import { createRouter, createWebHistory } from 'vue-router';

// Auth Views
import Login from '../views/auth/Login.vue';

// Dashboard Views
import Dashboard from '../views/Dashboard.vue';

// Vehicle Views
import VehicleList from '../views/vehicles/VehicleList.vue';
import VehicleDetails from '../views/vehicles/VehicleDetails.vue';
import VehicleCreate from '../views/vehicles/VehicleCreate.vue';
import VehicleEdit from '../views/vehicles/VehicleEdit.vue';
import VehicleTypes from '../views/vehicles/VehicleTypes.vue';

// Booking Views
import BookingList from '../views/bookings/BookingList.vue';
import BookingDetails from '../views/bookings/BookingDetails.vue';
import BookingCreate from '../views/bookings/BookingCreate.vue';
import BookingEdit from '../views/bookings/BookingEdit.vue';
import BookingApprovals from '../views/bookings/BookingApprovals.vue';

// Maintenance Views
import MaintenanceList from '../views/maintenance/MaintenanceList.vue';
import MaintenanceCreate from '../views/maintenance/MaintenanceCreate.vue';
import MaintenanceEdit from '../views/maintenance/MaintenanceEdit.vue';

// Fuel Log Views
import FuelLogList from '../views/fuel-logs/FuelLogList.vue';
import FuelLogCreate from '../views/fuel-logs/FuelLogCreate.vue';
import FuelLogEdit from '../views/fuel-logs/FuelLogEdit.vue';

// User Views
import UserList from '../views/users/UserList.vue';
import UserCreate from '../views/users/UserCreate.vue';
import UserEdit from '../views/users/UserEdit.vue';
import UserProfile from '../views/users/UserProfile.vue';

// Location Views
import LocationList from '../views/locations/LocationList.vue';
import LocationCreate from '../views/locations/LocationCreate.vue';
import LocationEdit from '../views/locations/LocationEdit.vue';

// Report Views
import ReportDashboard from '../views/reports/ReportDashboard.vue';
import BookingReport from '../views/reports/BookingReport.vue';
import UtilizationReport from '../views/reports/UtilizationReport.vue';
import MaintenanceReport from '../views/reports/MaintenanceReport.vue';
import FuelReport from '../views/reports/FuelReport.vue';

const routes = [
  // Auth routes
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  
  // Dashboard route
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  
  // Vehicle routes
  {
    path: '/vehicles',
    name: 'vehicles',
    component: VehicleList,
    meta: { requiresAuth: true }
  },
  {
    path: '/vehicles/create',
    name: 'vehicle-create',
    component: VehicleCreate,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/vehicles/:id',
    name: 'vehicle-details',
    component: VehicleDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/vehicles/:id/edit',
    name: 'vehicle-edit',
    component: VehicleEdit,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/vehicle-types',
    name: 'vehicle-types',
    component: VehicleTypes,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  
  // Booking routes
  {
    path: '/bookings',
    name: 'bookings',
    component: BookingList,
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings/create',
    name: 'booking-create',
    component: BookingCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings/:id',
    name: 'booking-details',
    component: BookingDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings/:id/edit',
    name: 'booking-edit',
    component: BookingEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/approvals',
    name: 'booking-approvals',
    component: BookingApprovals,
    meta: { requiresAuth: true, requiresApprover: true }
  },
  
  // Maintenance routes
  {
    path: '/maintenance',
    name: 'maintenance',
    component: MaintenanceList,
    meta: { requiresAuth: true }
  },
  {
    path: '/maintenance/create',
    name: 'maintenance-create',
    component: MaintenanceCreate,
    meta: { requiresAuth: true, requiresApprover: true }
  },
  {
    path: '/maintenance/:id/edit',
    name: 'maintenance-edit',
    component: MaintenanceEdit,
    meta: { requiresAuth: true, requiresApprover: true }
  },
  
  // Fuel Log routes
  {
    path: '/fuel-logs',
    name: 'fuel-logs',
    component: FuelLogList,
    meta: { requiresAuth: true }
  },
  {
    path: '/fuel-logs/create',
    name: 'fuel-log-create',
    component: FuelLogCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/fuel-logs/:id/edit',
    name: 'fuel-log-edit',
    component: FuelLogEdit,
    meta: { requiresAuth: true }
  },
  
  // User routes
  {
    path: '/users',
    name: 'users',
    component: UserList,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/users/create',
    name: 'user-create',
    component: UserCreate,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/users/:id/edit',
    name: 'user-edit',
    component: UserEdit,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/profile',
    name: 'user-profile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  
  // Location routes
  {
    path: '/locations',
    name: 'locations',
    component: LocationList,
    meta: { requiresAuth: true }
  },
  {
    path: '/locations/create',
    name: 'location-create',
    component: LocationCreate,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/locations/:id/edit',
    name: 'location-edit',
    component: LocationEdit,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  
  // Report routes
  {
    path: '/reports',
    name: 'reports',
    component: ReportDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/reports/bookings',
    name: 'booking-report',
    component: BookingReport,
    meta: { requiresAuth: true }
  },
  {
    path: '/reports/utilization',
    name: 'utilization-report',
    component: UtilizationReport,
    meta: { requiresAuth: true }
  },
  {
    path: '/reports/maintenance',
    name: 'maintenance-report',
    component: MaintenanceReport,
    meta: { requiresAuth: true }
  },
  {
    path: '/reports/fuel',
    name: 'fuel-report',
    component: FuelReport,
    meta: { requiresAuth: true }
  },
  
  // 404 route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;