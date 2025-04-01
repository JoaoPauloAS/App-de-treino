
/**
 * @file utils.ts
 * @description Funções utilitárias reutilizáveis para toda a aplicação
 * Contém helpers para manipulação de classes CSS e outras utilidades comuns
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Função utilitária para combinar classes CSS de forma inteligente
 * Utiliza clsx para processar condicionais e twMerge para resolver conflitos do Tailwind
 * 
 * @param {...ClassValue[]} inputs - Lista de classes, objetos ou arrays a serem combinados
 * @returns {string} String de classes CSS combinadas e otimizadas
 * 
 * @example
 * // Combina classes com condicionais
 * cn('base-class', isActive && 'active', { 'disabled': isDisabled })
 * 
 * // Resolve conflitos de tailwind
 * cn('px-2 py-1', 'px-4') // Resultado: 'py-1 px-4'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
