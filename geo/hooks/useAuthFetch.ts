import { useAuth } from '../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';

// Tipos para as opções do fetch
interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Tipo para o retorno do hook
interface UseAuthFetchReturn {
  authFetch: <T = any>(url: string, options?: FetchOptions) => Promise<{
    response: Response;
    data: T;
  }>;
  authFetchRaw: (url: string, options?: FetchOptions) => Promise<Response>;
}

export const useAuthFetch = (): UseAuthFetchReturn => {
  const { userToken } = useAuth();

  const authFetchRaw = async (url: string, options: FetchOptions = {}): Promise<Response> => {
    const token = userToken || await SecureStore.getItemAsync('userToken');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expirado ou inválido
      await SecureStore.deleteItemAsync('userToken');
      // Você pode querer redirecionar para login aqui
      // router.replace('/screens/auth/login');
      throw new Error('Sessão expirada');
    }

    return response;
  };

  const authFetch = async <T = any>(url: string, options: FetchOptions = {}): Promise<{
    response: Response;
    data: T;
  }> => {
    const response = await authFetchRaw(url, options);
    
    let data: T;
    try {
      data = await response.json() as T;
    } catch (error) {
      throw new Error('Erro ao parsear resposta JSON');
    }

    return { response, data };
  };

  return { authFetch, authFetchRaw };
};

// Versão alternativa se preferir uma função mais simples
export const useAuthFetchSimple = (): {
  authFetch: (url: string, options?: FetchOptions) => Promise<Response>;
} => {
  const { userToken } = useAuth();

  const authFetch = async (url: string, options: FetchOptions = {}): Promise<Response> => {
    const token = userToken || await SecureStore.getItemAsync('userToken');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      await SecureStore.deleteItemAsync('userToken');
      throw new Error('Sessão expirada');
    }

    return response;
  };

  return { authFetch };
};