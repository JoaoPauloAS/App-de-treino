
/**
 * @file use-mobile.tsx
 * @description Hook customizado para detectar se o dispositivo está em viewport mobile
 * Utiliza media queries para detectar mudanças no tamanho da tela e atualizar o estado
 */

import * as React from "react"

/**
 * Constante que define o breakpoint de mobile em pixels
 * Dispositivos com largura menor que este valor são considerados mobile
 */
const MOBILE_BREAKPOINT = 768

/**
 * Hook que detecta se o dispositivo atual está em viewport mobile
 * Utiliza media queries e eventos de resize para manter o estado atualizado
 * 
 * @returns {boolean} true se o dispositivo estiver em viewport mobile, false caso contrário
 */
export function useIsMobile() {
  // Estado para armazenar se o dispositivo é mobile ou não
  // Inicialmente undefined até que seja calculado no efeito
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // Efeito para detectar o tamanho da tela e configurar listeners
  React.useEffect(() => {
    // Cria um media query para detectar viewports mobile
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Função para atualizar o estado com base no tamanho atual da tela
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Adiciona listener para mudanças no media query
    mql.addEventListener("change", onChange)
    
    // Define o estado inicial com base no tamanho atual da tela
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Limpa o listener quando o componente é desmontado
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Retorna o estado atual, convertendo undefined para false para garantir um boolean
  return !!isMobile
}
