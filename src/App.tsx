
// Importações de componentes e bibliotecas
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SharedWorkout from "./pages/SharedWorkout";
import SharedWorkouts from "./pages/SharedWorkouts";
import MesoCycles from "./pages/MesoCycles";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./hooks/use-theme";
import { AuthProvider } from "./context/AuthContext";

// Configuração do cliente de consulta com opções padrão
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Desabilita nova consulta quando a janela ganha foco
      retry: 1, // Configura apenas uma tentativa de nova consulta em caso de falha
    },
  },
});

// Componente principal da aplicação
const App = () => (
  // Configura o roteamento da aplicação
  <BrowserRouter>
    {/* Provedor do cliente de consulta para gerenciamento de dados */}
    <QueryClientProvider client={queryClient}>
      {/* Provedor de tema para gerenciar o tema claro/escuro */}
      <ThemeProvider defaultTheme="system">
        {/* Provedor de autenticação para gerenciar o estado de login */}
        <AuthProvider>
          {/* Provedor de tooltip para exibir dicas na interface */}
          <TooltipProvider>
            {/* Container principal da aplicação */}
            <div className="min-h-[100dvh] bg-background text-foreground antialiased">
              {/* Componentes para exibição de notificações toast */}
              <Toaster />
              <Sonner position="top-right" closeButton />
              {/* Definição das rotas da aplicação */}
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/shared" element={<SharedWorkouts />} />
                <Route path="/mesocycles" element={<MesoCycles />} />
                <Route path="/workout/:id" element={<SharedWorkout />} />
                {/* Rota de fallback para caminhos não encontrados */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
