"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const inlineAlertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success: "border-green-500/50 bg-green-50 text-green-900 dark:border-green-500/50 dark:bg-green-950/50 dark:text-green-100 [&>svg]:text-green-600 dark:[&>svg]:text-green-500",
        error: "border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive [&>svg]:text-destructive",
        warning: "border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:border-yellow-500/50 dark:bg-yellow-950/50 dark:text-yellow-100 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-500",
        info: "border-blue-500/50 bg-blue-50 text-blue-900 dark:border-blue-500/50 dark:bg-blue-950/50 dark:text-blue-100 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const iconMap = {
  default: Info,
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

export interface InlineAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inlineAlertVariants> {
  onDismiss?: () => void
  showIcon?: boolean
}

const InlineAlert = React.forwardRef<HTMLDivElement, InlineAlertProps>(
  ({ className, variant = "default", onDismiss, showIcon = true, children, ...props }, ref) => {
    const Icon = iconMap[variant || "default"]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(inlineAlertVariants({ variant }), className)}
        {...props}
      >
        {showIcon && <Icon className="h-4 w-4" />}
        <div className="flex-1">{children}</div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute right-2 top-2 rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
InlineAlert.displayName = "InlineAlert"

const InlineAlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
InlineAlertTitle.displayName = "InlineAlertTitle"

const InlineAlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
InlineAlertDescription.displayName = "InlineAlertDescription"

export { InlineAlert, InlineAlertTitle, InlineAlertDescription }

