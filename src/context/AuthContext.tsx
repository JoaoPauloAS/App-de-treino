
/**
 * @file AuthContext.tsx
 * @description Implementação do contexto de autenticação da aplicação
 * Gerencia o estado de autenticação do usuário, incluindo login, cadastro e logout
 * Utiliza localStorage para persistir dados entre sessões (simplificação para demonstração)
 */

// Importação de dependências React e tipos necessários
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/workout';
import { v4 as uuidv4 } from 'uuid';

/**
 * Definição do tipo para o contexto de autenticação
 * Define a estrutura e métodos disponíveis para componentes consumidores
 */
interface AuthContextType {
  user: User | null;           // Usuário atual ou null se não autenticado
  isAuthenticated: boolean;    // Flag indicando se o usuário está autenticado
  login: (email: string, password: string) => Promise<boolean>; // Função de login
  signup: (username: string, email: string, password: string) => Promise<boolean>; // Função de cadastro
  logout: () => void;          // Função de logout
}

/**
 * Criação do contexto de autenticação com valores padrão
 * Inicializa o contexto com estado não-autenticado e funções vazias
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
});

/**
 * Hook customizado para acessar o contexto de autenticação
 * Facilita o acesso ao contexto em componentes funcionais
 * @returns {AuthContextType} O valor atual do contexto de autenticação
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Provedor de autenticação que gerencia o estado global de autenticação
 * Envolve os componentes filhos e disponibiliza o estado e funções de autenticação
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos a serem envolvidos pelo provedor
 * @returns {JSX.Element} Provedor de contexto com estado de autenticação
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados para armazenar informações do usuário e status de autenticação
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Efeito que verifica se o usuário já está autenticado ao carregar a aplicação
   * Recupera dados de autenticação do localStorage, se disponíveis
   */
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

  /**
   * Função para autenticar o usuário
   * Verifica credenciais contra os dados armazenados no localStorage
   * Nota: Em produção, seria substituída por chamadas a uma API segura
   * 
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<boolean>} Resultado da operação de login
   */
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

  /**
   * Função para cadastrar um novo usuário
   * Cria um novo registro de usuário no localStorage
   * Nota: Em produção, seria substituída por chamadas a uma API segura
   * 
   * @param {string} username - Nome de usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<boolean>} Resultado da operação de cadastro
   */
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

  /**
   * Função para fazer logout do usuário
   * Limpa o estado de autenticação e remove dados do localStorage
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  /**
   * Fornece o contexto de autenticação para os componentes filhos
   */
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
