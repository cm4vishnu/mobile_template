import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "group pointer-events-auto flex items-center gap-3 overflow-hidden rounded-lg px-4 py-3 text-sm font-medium transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:opacity-[var(--radix-toast-swipe-move-y)] data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=end]:opacity-[var(--radix-toast-swipe-end-y)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:zoom-in data-[state=closed]:zoom-out",
  {
    variants: {
      variant: {
        default:
          "group/toast group/toast:bg-background group/toast:text-foreground group/toast:border group/toast:border-border group/toast:shadow-lg",
        destructive:
          "group/toast group/toast:destructive:bg-destructive group/toast:destructive:text-destructive-foreground group/toast:destructive:border-transparent group/toast:destructive:shadow-lg",
      },
      position: {
        topLeft: "group/toast group-data-[position=top-left]:md:slide-in-from-top-left",
        topRight: "group/toast group-data-[position=top-right]:md:slide-in-from-top-right",
        bottomLeft: "group/toast group-data-[position=bottom-left]:md:slide-in-from-bottom-left",
        bottomRight: "group/toast group-data-[position=bottom-right]:md:slide-in-from-bottom-right",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "topRight",
    },
  }
);

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: "default" | "destructive";
  position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, variant, position, ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toastVariants({ variant, position }), className)}
      {...props}
    />
  );
});

Toast.displayName = ToastPrimitive.Root.displayName;

export const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group/toast:hover:bg-secondary group/toast:[&[data-state=open]_&]:bg-secondary",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitive.Action.displayName;

export const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-1 hover:bg-secondary group/toast:[&[data-state=open]_&]:bg-secondary",
      className
    )}
    {...props}
  />
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

export type ToastActionElement = React.ReactElement<typeof ToastAction>;