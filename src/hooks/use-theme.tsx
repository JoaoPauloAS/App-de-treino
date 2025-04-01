
/**
 * @file use-theme.tsx
 * @description Hook e Provider para gerenciamento do tema da aplicação
 * Permite alternar entre temas claro, escuro e sistema, com persistência em localStorage
 */

import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Tipo que define os temas disponíveis na aplicação
 */
type Theme = 'dark' | 'light' | 'system';

/**
 * Interface que define as propriedades esperadas pelo ThemeProvider
 * @property {React.ReactNode} children - Componentes filhos que terão acesso ao tema
 * @property {Theme} defaultTheme - Tema padrão a ser usado quando não há preferência salva
 * @property {string} storageKey - Chave usada para salvar a preferência no localStorage
 */
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

/**
 * Interface para o estado do provedor de tema
 * Define a estrutura do contexto que será disponibilizado aos componentes
 */
interface ThemeProviderState {
  theme: Theme;                 // Tema atual
  setTheme: (theme: Theme) => void; // Função para alterar o tema
}

/**
 * Estado inicial do contexto com valores padrão
 */
const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

/**
 * Contexto para compartilhar o estado do tema entre componentes
 */
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * Provedor de tema que gerencia o tema da aplicação
 * Aplica o tema ao elemento root do documento e persiste a preferência
 * 
 * @param {ThemeProviderProps} props - Propriedades do componente
 * @returns {JSX.Element} Provedor de contexto com estado de tema
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  // Estado para armazenar o tema atual, inicializado a partir do localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey);
    return (storedTheme as Theme) || defaultTheme;
  });

  /**
   * Efeito para aplicar a classe do tema ao elemento root do documento
   * Executa sempre que o tema muda para atualizar a aparência da aplicação
   */
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    } 
    
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  /**
   * Efeito para escutar mudanças na preferência do sistema
   * Atualiza o tema automaticamente quando o usuário altera o tema do sistema
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(
          mediaQuery.matches ? 'dark' : 'light'
        );
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Prepara o valor do contexto com o tema atual e a função para alterá-lo
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
  };

  // Fornece o contexto de tema para os componentes filhos
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * Hook customizado para acessar o contexto de tema
 * Facilita o acesso ao tema atual e à função para alterá-lo em componentes funcionais
 * 
 * @returns {ThemeProviderState} O valor atual do contexto de tema
 * @throws {Error} Se usado fora de um ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
