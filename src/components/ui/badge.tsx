
/**
 * @file badge.tsx
 * @description Componente de badge para exibir status, contadores ou etiquetas
 * Oferece diferentes variantes de estilo
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Definição das variantes de estilo do badge usando cva
 * Configura classes para diferentes estilos visuais
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Interface das props do componente Badge
 * Estende HTMLDivElement e adiciona propriedades de variante
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Componente Badge
 * Exibe uma etiqueta estilizada baseada na variante escolhida
 * 
 * @param {BadgeProps} props - Propriedades do badge
 * @returns {JSX.Element} Badge estilizado
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
