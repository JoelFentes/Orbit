import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { router } from 'expo-router';

// Interface do payload do JWT (ajuste conforme seu backend)
interface DecodedToken {
  sub: string;
  name: string;
  email: string;
  exp?: number;
}

// Interface do usuário que vamos guardar
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  userToken: string | null;
  isLoading: boolean;
  login: (token: string, userFromApi?: any) => Promise<void>; // 👈 agora aceita user
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}


interface AuthProviderProps {
  children: ReactNode;
}

// Criar o contexto com tipo
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('AuthProvider mounted - Carregando token...');
    loadToken();
  }, []);

  useEffect(() => {
    async function checkToken() {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        await login(token);
        router.replace("../main/home");
      }
    }
    checkToken();
  }, []);


  const decodeAndSetUser = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser({
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
      });
    } catch (err) {
      console.error('Erro ao decodificar token:', err);
      setUser(null);
    }
  };

  const loadToken = async (): Promise<void> => {
    try {
      console.log('Buscando token no SecureStore...');
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        console.log('Token encontrado:', token.substring(0, 20) + '...');
        setUserToken(token);
        decodeAndSetUser(token);
      } else {
        console.log('Nenhum token encontrado no SecureStore');
      }
    } catch (error) {
      console.error('Erro ao carregar token:', error);
    } finally {
      console.log('Loading finalizado');
      setIsLoading(false);
    }
  };

  const login = async (token: string, userFromApi?: any): Promise<void> => {
    try {
      console.log('Salvando token no SecureStore...');
      await SecureStore.setItemAsync('userToken', token);
      setUserToken(token);

      if (userFromApi) {
        setUser({
          id: userFromApi.id,
          name: userFromApi.name,
          email: userFromApi.email,
        });
      } else {
        decodeAndSetUser(token);
      }

      console.log('Token salvo e usuário carregado!');
    } catch (error) {
      console.error('Erro ao salvar token:', error);
      throw error;
    }
  };


  const logout = async (): Promise<void> => {
    try {
      console.log('Removendo token do SecureStore...');
      await SecureStore.deleteItemAsync('userToken');
      setUserToken(null);
      setUser(null);
      console.log('Token removido e usuário limpo!');
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  };

  useEffect(() => {
    console.log('Token atualizado:', userToken ? 'Token presente' : 'Token null');
    console.log('Usuário autenticado:', !!userToken);
  }, [userToken]);

  const value: AuthContextData = {
    user,
    userToken,
    isLoading,
    login,
    logout,
    isAuthenticated: !!userToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
