import { Router } from 'express';
import { OrderController } from './orders.controller';
import { authMiddleware, requireRole } from '../../middleware/auth';

const router = Router();

// CONSUMER routes
router.post('/', authMiddleware, requireRole('consumer'), OrderController.createOrder);
router.get('/my-orders', authMiddleware, requireRole('consumer'), OrderController.getConsumerOrders);

// DELIVERY routes
router.get('/available/list', authMiddleware, requireRole('delivery'), OrderController.getAvailableOrders);
router.patch('/:id/accept', authMiddleware, requireRole('delivery'), OrderController.acceptOrder);
router.patch('/:id/reject', authMiddleware, requireRole('delivery'), OrderController.rejectOrder);
router.get('/my-deliveries/list', authMiddleware, requireRole('delivery'), OrderController.getDeliveryOrders);

// STORE routes
router.get('/store/:storeId', authMiddleware, requireRole('store'), OrderController.getStoreOrders);

// Consulta puntual (públi ca)
router.get('/:id', OrderController.getOrderById);

export default router;
