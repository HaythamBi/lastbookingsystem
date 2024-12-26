import express from 'express';
import { 
  getCustomerBookingsHandler, 
  createBookingHandler, 
  cancelBookingHandler 
} from '../controllers/bookingController.js';

const router = express.Router();

router.get('/:customerId', getCustomerBookingsHandler);
router.post('/', createBookingHandler);
router.post('/:id/cancel', cancelBookingHandler);

export default router;