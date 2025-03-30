
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/workout';
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já está autenticado
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao analisar dados do usuário:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulando verificação de login (em produção, isso seria uma chamada de API)
    const usersData = localStorage.getItem('users');
    if (!usersData) return false;

    try {
      const users = JSON.parse(usersData);
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === password // Nota: Em produção, usar hash de senha
      );

      if (foundUser) {
        // Removendo a senha antes de armazenar no estado
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
    
    return false;
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    // Verificar se o email já está em uso
    const usersData = localStorage.getItem('users');
    let users = [];
    
    if (usersData) {
      try {
        users = JSON.parse(usersData);
        if (users.some((u: any) => u.email === email)) {
          return false; // Email já em uso
        }
      } catch (error) {
        console.error('Erro ao verificar email:', error);
      }
    }

    // Criar novo usuário
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password, // Nota: Em produção, usar hash de senha
      createdAt: new Date(),
      workouts: [],
      workoutSheets: [],
      savedWorkouts: [],
      bodyMeasurements: []
    };

    // Salvar o novo usuário
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Autenticar o usuário
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
