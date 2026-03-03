import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF6B35] text-white shadow-md hover:bg-[#E85A2A] hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus-visible:ring-[#FF8C61]",
        secondary:
          "bg-[#00C9A7] text-white shadow-md hover:bg-[#00B396] hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus-visible:ring-[#00C9A7]",
        destructive:
          "bg-[#FF5757] text-white shadow-md hover:bg-[#FF3838] hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus-visible:ring-[#FF5757]",
        outline:
          "border-2 border-[#FF6B35] text-[#FF6B35] bg-transparent hover:bg-[#FF6B35] hover:text-white hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-[#FF8C61]",
        ghost: "hover:bg-[#FF6B35]/10 hover:text-[#FF6B35]",
        link: "text-[#FF6B35] underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-[#FF6B35] to-[#FF8C61] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-[#FF8C61]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs rounded-md",
        lg: "h-11 px-8 text-base rounded-lg",
        xl: "h-12 px-10 text-base rounded-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
