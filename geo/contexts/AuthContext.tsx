import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { router } from 'expo-router';

// Interface do payload do JWT
interface DecodedToken {
  sub: string;
  exp?: number;
}

// Interface do usuário salvo no app
interface User {
  id: string;
  name: string;
  email: string;
  photo?: string | null;
}

interface AuthContextData {
  user: User | null;
  userToken: string | null;
  isLoading: boolean;
  login: (token: string, userFromApi?: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (name: string, photo?: string | null) => void;
  isAuthenticated: boolean;
  
}

interface AuthProviderProps {
  children: ReactNode;
}

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

  // Executado quando o app abre
  useEffect(() => {
    loadTokenAndUser();
  }, []);

  // Carrega token do SecureStore e busca usuário completo no backend
  const loadTokenAndUser = async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync('userToken');

      if (token) {
        setUserToken(token);

        // Decodifica apenas o ID do usuário
        const decoded = jwtDecode<DecodedToken>(token);

        if (decoded?.sub) {
          // Busca os dados completos do usuário no backend
          const response = await fetch(`http://192.168.18.12:4000/users/${decoded.sub}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const data = await response.json();
          setUser({
            id: data.id,
            name: data.name,
            email: data.email,
            photo: data.photo ?? null
          });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar token e usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login do usuário
  const login = async (token: string, userFromApi?: any): Promise<void> => {
    try {
      await SecureStore.setItemAsync('userToken', token);
      setUserToken(token);

      if (userFromApi) {
        setUser({
          id: userFromApi.id,
          name: userFromApi.name,
          email: userFromApi.email,
          photo: userFromApi.photo ?? null,
        });
      }

      router.replace("/screens/main/home");

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  // Atualizar nome e foto do usuário no contexto
  const updateUserProfile = (name: string, photo?: string | null) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            name,
            photo: photo ?? prev.photo,
          }
        : prev
    );
  };

  const logout = async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      setUserToken(null);
      setUser(null);
      router.replace("/screens/auth/login");
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const value: AuthContextData = {
    user,
    userToken,
    isLoading,
    login,
    logout,
    updateUserProfile,
    isAuthenticated: !!userToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
