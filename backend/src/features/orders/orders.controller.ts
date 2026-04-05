import { Request, Response, NextFunction } from 'express';
import { OrderService } from './orders.service';
import { CreateOrderDTO } from '../../types';
import * as boom from '@hapi/boom';
import { supabase } from '../../config/supabase';

export class OrderController {
  // CONSUMER: Crear orden
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw boom.unauthorized('Usuario no autenticado');
      }

      const dto: CreateOrderDTO = req.body;

      if (!dto.store_id || !dto.items || dto.items.length === 0) {
        throw boom.badRequest('store_id e items son requeridos');
      }

      const result = await OrderService.createOrder(req.user.id, dto);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // CONSUMER: Listar mis órdenes
  static async getConsumerOrders(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw boom.unauthorized('Usuario no autenticado');
      }

      const orders = await OrderService.getConsumerOrders(req.user.id);
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  // DELIVERY: Listar órdenes disponibles
  static async getAvailableOrders(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw boom.unauthorized('Usuario no autenticado');
      }

      const orders = await OrderService.getAvailableOrders(req.user.id);
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  // DELIVERY: Aceptar orden
  static async acceptOrder(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw boom.unauthorized('Usuario no autenticado');
      }

      const { id } = req.params;
      const order = await OrderService.acceptOrder(String(id), req.user.id);
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  // DELIVERY: Rechazar orden
  static async rejectOrder(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw boom.unauthorized('Usuario no autenticado');
      }

      const { id } = req.params;
      await OrderService.rejectOrder(String(id), req.user.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // DELIVERY: Listar mis entregas
  static async getDeliveryOrders(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw boom.unauthorized('Usuario no autenticado');
      }

      const orders = await OrderService.getDeliveryOrders(req.user.id);
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  // STORE: Listar órdenes de su tienda
  static async getStoreOrders(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw boom.unauthorized('Usuario no autenticado');
      }

      const { storeId } = req.params;

      // Verificar que el store es del usuario
      const { data: store } = await supabase
        .from('stores')
        .select('user_id')
        .eq('id', String(storeId))
        .single();

      if (!store || store.user_id !== req.user.id) {
        throw boom.forbidden('No puedes ver las órdenes de esta tienda');
      }

      const orders = await OrderService.getStoreOrders(String(storeId));
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  // Consulta puntual
  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(String(id));
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
}
