
/**
 * @file use-toast.ts
 * @description Sistema de toast para exibir notificações na interface
 * Implementa um gerenciador de estado para toasts usando Redux pattern
 */

import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

/**
 * Configurações globais para o sistema de toast
 */
const TOAST_LIMIT = 1                // Número máximo de toasts simultâneos
const TOAST_REMOVE_DELAY = 1000000   // Tempo em ms para remover o toast após fechado

/**
 * Tipo que representa um toast com todos os dados necessários
 * Estende ToastProps com campos adicionais como id e conteúdo
 */
type ToasterToast = ToastProps & {
  id: string                       // Identificador único do toast
  title?: React.ReactNode          // Título opcional do toast
  description?: React.ReactNode    // Descrição opcional do toast
  action?: ToastActionElement      // Ação opcional do toast (botão, etc)
}

/**
 * Tipos de ações que podem ser despachadas para o reducer
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",           // Adicionar um novo toast
  UPDATE_TOAST: "UPDATE_TOAST",     // Atualizar um toast existente
  DISMISS_TOAST: "DISMISS_TOAST",   // Fechar um toast
  REMOVE_TOAST: "REMOVE_TOAST",     // Remover um toast do DOM
} as const

/**
 * Contador para gerar IDs únicos para os toasts
 */
let count = 0

/**
 * Gera um ID único para um novo toast
 * @returns {string} ID único como string
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

/**
 * Tipo abreviado para referência dos tipos de ações
 */
type ActionType = typeof actionTypes

/**
 * União discriminada de todos os tipos de ações possíveis
 * com suas respectivas payloads
 */
type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

/**
 * Interface que define o estado global dos toasts
 */
interface State {
  toasts: ToasterToast[]
}

/**
 * Mapa para armazenar os timeouts de remoção dos toasts
 */
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Adiciona um toast à fila de remoção
 * Configura um timeout para remover o toast após o delay configurado
 * 
 * @param {string} toastId - ID do toast a ser removido
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * Reducer para gerenciar o estado dos toasts
 * Implementa a lógica para adicionar, atualizar, fechar e remover toasts
 * 
 * @param {State} state - Estado atual dos toasts
 * @param {Action} action - Ação a ser processada
 * @returns {State} Novo estado após processar a ação
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

/**
 * Lista de funções ouvintes para notificar mudanças no estado
 */
const listeners: Array<(state: State) => void> = []

/**
 * Estado em memória dos toasts, inicialmente vazio
 */
let memoryState: State = { toasts: [] }

/**
 * Função para despachar ações e atualizar o estado
 * Notifica todos os ouvintes registrados sobre a mudança
 * 
 * @param {Action} action - Ação a ser processada
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

/**
 * Tipo simplificado para criar um toast, sem o ID
 */
type Toast = Omit<ToasterToast, "id">

/**
 * Cria e mostra um novo toast
 * 
 * @param {Toast} props - Propriedades do toast a ser criado
 * @returns {Object} Métodos para manipular o toast criado
 */
function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * Hook customizado para acessar e manipular toasts
 * Permite componentes reagirem a mudanças no estado dos toasts
 * 
 * @returns {Object} Estado atual e métodos para manipular toasts
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
