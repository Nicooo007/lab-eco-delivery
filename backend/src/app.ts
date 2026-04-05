import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

// Importar routers
import authRouter from './features/auth/auth.router';
import storesRouter from './features/stores/stores.router';
import productsRouter from './features/products/products.router';
import ordersRouter from './features/orders/orders.router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/stores', storesRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
