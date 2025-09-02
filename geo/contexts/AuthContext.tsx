import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

// Tipos para o contexto
interface AuthContextData {
  userToken: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
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

// contexts/AuthContext.tsx
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('AuthProvider mounted - Carregando token...');
    loadToken();
  }, []);

  const loadToken = async (): Promise<void> => {
    try {
      console.log('Buscando token no SecureStore...');
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        console.log('Token encontrado:', token.substring(0, 20) + '...');
        setUserToken(token);
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

  const login = async (token: string): Promise<void> => {
    try {
      console.log('Salvando token no SecureStore...');
      await SecureStore.setItemAsync('userToken', token);
      setUserToken(token);
      console.log('Token salvo com sucesso!');
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
      console.log('Token removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  };

  // Log sempre que o token mudar
  useEffect(() => {
    console.log('Token atualizado:', userToken ? 'Token presente' : 'Token null');
    console.log('Usuário autenticado:', !!userToken);
  }, [userToken]);

  const value: AuthContextData = {
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