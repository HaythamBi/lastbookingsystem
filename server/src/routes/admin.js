import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getBookings,
  getWorkers,
  updateBooking
} from '../controllers/adminController.js';
import {
  getCustomers,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js';
import {
  getClinicHours,
  getMonthHours,
  updateClinicHours
} from '../controllers/clinicController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(requireAuth, requireAdmin);

// Dashboard and booking routes
router.get('/stats', getDashboardStats);
router.get('/bookings', getBookings);
router.get('/workers', getWorkers);
router.put('/bookings/:id', updateBooking);

// Customer management routes
router.get('/customers', getCustomers);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);

// Clinic hours management routes
router.get('/clinic-hours', getClinicHours);
router.get('/clinic-hours/month/:date', getMonthHours);
router.put('/clinic-hours/date/:date', updateClinicHours);

export default router;