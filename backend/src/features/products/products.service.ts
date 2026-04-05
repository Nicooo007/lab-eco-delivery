import { supabase } from '../../config/supabase';
import { Product, CreateProductDTO } from '../../types';
import * as boom from '@hapi/boom';

export class ProductService {
  static async getProductsByStore(storeId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) {
      throw boom.internal(error.message);
    }

    return data || [];
  }

  static async getProductById(id: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw boom.notFound('Producto no encontrado');
    }

    return data;
  }

  static async createProduct(
    storeId: string,
    userId: string,
    dto: CreateProductDTO
  ): Promise<Product> {
    // Verificar que el store pertenece al usuario
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('user_id')
      .eq('id', storeId)
      .single();

    if (storeError || !store || store.user_id !== userId) {
      throw boom.forbidden(
        'No puedes crear productos para esta tienda'
      );
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        store_id: storeId,
        name: dto.name,
        price: dto.price,
      })
      .select()
      .single();

    if (error) {
      throw boom.internal(error.message);
    }

    return data;
  }

  static async getProductsByIds(productIds: string[]): Promise<Product[]> {
    if (productIds.length === 0) return [];

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (error) {
      throw boom.internal(error.message);
    }

    return data || [];
  }
}
