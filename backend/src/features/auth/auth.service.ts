import { supabase } from '../../config/supabase';
import { RegisterDTO, LoginDTO } from '../../types';
import * as boom from '@hapi/boom';

export class AuthService {
  static async register(dto: RegisterDTO) {
    // 1. Crear usuario en Supabase Auth con metadata
    const metadata = {
      role: dto.role,
      name: dto.name,
      address: dto.address,
      storeName: dto.storeName,
    };

    const { data, error } = await supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      throw boom.badRequest(error.message);
    }

    // Auto-confirm email for development
    if (data.user?.id) {
      await supabase.auth.admin.updateUserById(data.user.id, {
        email_confirm: true,
        user_metadata: metadata,
      });
    }

    // 2. Si es store, crear la entrada en la tabla stores
    if (dto.role === 'store' && dto.storeName) {
      const { error: storeError } = await supabase.from('stores').insert({
        user_id: data.user?.id,
        name: dto.storeName,
        is_open: false,
      });

      if (storeError) {
        throw boom.internal('Error al crear la tienda');
      }
    }

    return {
      message: 'Usuario registrado exitosamente',
      user: data.user,
    };
  }

  static async login(dto: LoginDTO) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw boom.unauthorized(error.message);
    }

    // Generar sesión/token
    const { data: sessionData } = await supabase.auth.getSession();

    return {
      user: data.user,
      session: sessionData.session,
    };
  }

  static async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw boom.internal(error.message);
    }
  }
}
