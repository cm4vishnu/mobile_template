"use client"

import {
  Toast,
  type ToastProps,
  ToastViewport,
  ToastProvider,
  ToastTitle,
  ToastAction,
  ToastDescription,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        ...props
      }: ToastProps) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-2">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
              {action}
            </div>
            {action && <ToastAction altText="Undo">{action}</ToastAction>}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}