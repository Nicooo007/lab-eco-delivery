import { supabase } from '../../config/supabase';
import { Store } from '../../types';
import * as boom from '@hapi/boom';

export class StoreService {
  static async getAllStores(): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw boom.internal(error.message);
    }

    return data || [];
  }

  static async getStoreById(id: string): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw boom.notFound('Tienda no encontrada');
    }

    return data;
  }

  static async getMyStore(userId: string): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw boom.notFound('No tienes una tienda asociada');
    }

    return data;
  }

  static async createStore(userId: string, name: string): Promise<Store> {
    // Verificar que no tenga una tienda previa
    const { data: existingStore } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingStore) {
      throw boom.conflict('Ya tienes una tienda asociada');
    }

    const { data, error } = await supabase
      .from('stores')
      .insert({
        user_id: userId,
        name,
        is_open: false,
      })
      .select()
      .single();

    if (error) {
      throw boom.internal(error.message);
    }

    return data;
  }

  static async updateStoreStatus(
    storeId: string,
    userId: string,
    isOpen: boolean
  ): Promise<Store> {
    // Verificar ownership
    const store = await this.getStoreById(storeId);
    if (store.user_id !== userId) {
      throw boom.forbidden('No puedes actualizar esta tienda');
    }

    const { data, error } = await supabase
      .from('stores')
      .update({ is_open: isOpen })
      .eq('id', storeId)
      .select()
      .single();

    if (error) {
      throw boom.internal(error.message);
    }

    return data;
  }
}
