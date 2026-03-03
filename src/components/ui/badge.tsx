import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#FF6B35] text-white shadow-sm hover:bg-[#E85A2A]",
        secondary:
          "border-transparent bg-[#00C9A7] text-white shadow-sm hover:bg-[#00B396]",
        success:
          "border-transparent bg-[#10D47C] text-white shadow-sm hover:bg-[#0EBE6F]",
        warning:
          "border-transparent bg-[#FFB627] text-[#1A1A2E] shadow-sm hover:bg-[#FFA500]",
        info:
          "border-transparent bg-[#4ECDC4] text-white shadow-sm hover:bg-[#3DBDB4]",
        destructive:
          "border-transparent bg-[#FF5757] text-white shadow-sm hover:bg-[#FF3838]",
        outline:
          "border-2 border-[#FF6B35] text-[#FF6B35] bg-transparent hover:bg-[#FF6B35]/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
