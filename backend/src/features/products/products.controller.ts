import { Request, Response, NextFunction } from 'express';
import { ProductService } from './products.service';
import { CreateProductDTO } from '../../types';
import * as boom from '@hapi/boom';

export class ProductController {
  static async getProductsByStore(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const products = await ProductService.getProductsByStore(String(storeId));
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(String(id));
      return res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw boom.unauthorized('Usuario no autenticado');
      }

      const { storeId } = req.params;
      const dto: CreateProductDTO = req.body;

      if (!dto.name || dto.price === undefined) {
        throw boom.badRequest('name y price son requeridos');
      }

      const product = await ProductService.createProduct(String(storeId), req.user.id, dto);
      return res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
}
