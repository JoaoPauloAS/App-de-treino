
/**
 * @file main.tsx
 * @description Ponto de entrada principal do aplicativo React
 * Este arquivo inicializa a aplicação React, renderizando o componente App
 * no elemento raiz do DOM.
 */

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Inicializa a aplicação React usando a API createRoot do React 18+
// Renderiza o componente App no elemento com id "root" do HTML
createRoot(document.getElementById("root")!).render(<App />);
