import { Router } from 'express';
import { ProductController } from './products.controller';
import { authMiddleware, requireRole } from '../../middleware/auth';

const router = Router();

// Rutas públicas
router.get('/store/:storeId', ProductController.getProductsByStore);
router.get('/:id', ProductController.getProductById);

// Rutas protegidas
router.post('/:storeId', authMiddleware, requireRole('store'), ProductController.createProduct);

export default router;
