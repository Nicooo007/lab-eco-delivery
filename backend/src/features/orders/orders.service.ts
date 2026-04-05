import { supabase } from '../../config/supabase';
import { Order, OrderItem, CreateOrderDTO } from '../../types';
import * as boom from '@hapi/boom';
import { ProductService } from '../products/products.service';

export class OrderService {
  // CONSUMER: Crear orden
  static async createOrder(
    userId: string,
    dto: CreateOrderDTO
  ): Promise<{ order: Order; items: OrderItem[] }> {
    // Validar que los productos pertenecen a la tienda
    const products = await ProductService.getProductsByIds(
      dto.items.map((item) => item.product_id)
    );

    const productsMap = new Map(products.map((p) => [p.id, p]));
    for (const item of dto.items) {
      const product = productsMap.get(item.product_id);
      if (!product || product.store_id !== dto.store_id) {
        throw boom.badRequest(`Producto ${item.product_id} no pertenece a esta tienda`);
      }
    }

    // Crear orden
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        store_id: dto.store_id,
        delivery_id: null,
        status: 'pendiente',
      })
      .select()
      .single();

    if (orderError) {
      throw boom.internal(orderError.message);
    }

    // Crear items
    const itemsToInsert = dto.items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert)
      .select();

    if (itemsError) {
      throw boom.internal(itemsError.message);
    }

    return {
      order: orderData,
      items: itemsData || [],
    };
  }

  // CONSUMER: Listar mis órdenes
  static async getConsumerOrders(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), stores(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw boom.internal(error.message);
    }

    return data || [];
  }

  // DELIVERY: Listar órdenes disponibles
  static async getAvailableOrders(deliveryId: string): Promise<any[]> {
    // Obtener órdenes rechazadas por este repartidor
    const { data: rejections } = await supabase
      .from('order_rejections')
      .select('order_id')
      .eq('delivery_id', deliveryId);

    const rejectedOrderIds = new Set((rejections || []).map((r) => r.order_id));

    // Obtener órdenes disponibles (sin delivery_id)
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), stores(name)')
      .eq('status', 'pendiente')
      .is('delivery_id', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw boom.internal(error.message);
    }

    // Filtrar órdenes rechazadas en código
    return (data || []).filter((order) => !rejectedOrderIds.has(order.id));
  }

  // DELIVERY: Aceptar orden
  static async acceptOrder(orderId: string, deliveryId: string): Promise<Order> {
    // Verificar que la orden existe y está disponible
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!order) {
      throw boom.notFound('Orden no encontrada');
    }

    if (order.status !== 'pendiente' || order.delivery_id !== null) {
      throw boom.conflict('Orden no está disponible');
    }

    // Actualizar orden
    const { data, error } = await supabase
      .from('orders')
      .update({
        delivery_id: deliveryId,
        status: 'aceptada',
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      throw boom.internal(error.message);
    }

    return data;
  }

  // DELIVERY: Rechazar orden
  static async rejectOrder(orderId: string, deliveryId: string): Promise<void> {
    const { error } = await supabase
      .from('order_rejections')
      .insert({
        order_id: orderId,
        delivery_id: deliveryId,
      });

    if (error) {
      throw boom.internal(error.message);
    }
  }

  // DELIVERY: Listar mis entregas
  static async getDeliveryOrders(deliveryId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), stores(name)')
      .eq('delivery_id', deliveryId)
      .eq('status', 'aceptada')
      .order('created_at', { ascending: false });

    if (error) {
      throw boom.internal(error.message);
    }

    return data || [];
  }

  // STORE: Listar órdenes de su tienda
  static async getStoreOrders(storeId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) {
      throw boom.internal(error.message);
    }

    return data || [];
  }

  // Consulta puntual de orden
  static async getOrderById(orderId: string): Promise<any> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), stores(name)')
      .eq('id', orderId)
      .single();

    if (error) {
      throw boom.notFound('Orden no encontrada');
    }

    return data;
  }
}
