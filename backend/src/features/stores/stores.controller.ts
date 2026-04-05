import { Request, Response, NextFunction } from 'express';
import { StoreService } from './stores.service';
import * as boom from '@hapi/boom';

export class StoreController {
  static async getAllStores(req: Request, res: Response, next: NextFunction) {
    try {
      const stores = await StoreService.getAllStores();
      return res.status(200).json(stores);
    } catch (error) {
      next(error);
    }
  }

  static async getMyStore(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw boom.unauthorized('Usuario no autenticado');
      }
      const store = await StoreService.getMyStore(req.user.id);
      return res.status(200).json(store);
    } catch (error) {
      next(error);
    }
  }

  static async createStore(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw boom.unauthorized('Usuario no autenticado');
      }
      const { name } = req.body;
      if (!name) {
        throw boom.badRequest('name es requerido');
      }
      const store = await StoreService.createStore(req.user.id, name);
      return res.status(201).json(store);
    } catch (error) {
      next(error);
    }
  }

  static async updateStoreStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw boom.unauthorized('Usuario no autenticado');
      }
      const { id } = req.params;
      const { is_open } = req.body;

      if (typeof is_open !== 'boolean') {
        throw boom.badRequest('is_open debe ser un booleano');
      }

      const storeId = Array.isArray(id) ? id[0] : id;
      const userId = Array.isArray(req.user.id) ? req.user.id[0] : req.user.id;

      if (!storeId || !userId) {
        throw boom.badRequest('id inválido');
      }

      const store = await StoreService.updateStoreStatus(storeId, userId, is_open);
      return res.status(200).json(store);
    } catch (error) {
      next(error);
    }
  }
}
