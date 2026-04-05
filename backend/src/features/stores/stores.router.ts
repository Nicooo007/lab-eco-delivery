import { Router } from 'express';
import { StoreController } from './stores.controller';
import { authMiddleware, requireRole } from '../../middleware/auth';

const router = Router();

// Rutas públicas
router.get('/', StoreController.getAllStores);

// Rutas protegidas
router.get('/me', authMiddleware, requireRole('store'), StoreController.getMyStore);
router.post('/', authMiddleware, requireRole('store'), StoreController.createStore);
router.patch('/:id/status', authMiddleware, requireRole('store'), StoreController.updateStoreStatus);

export default router;
