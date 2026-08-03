import { useToast } from "@/hooks/use-toast";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <SonnerToaster
      className="group toast group"
      toastOptions={{
        class: {
          toast: "group toast(group/sidebar-cta):bg-primary group[.toaster]:bg-background group[.toaster]:text-foreground group[.toaster]:border-border group[.toaster]:shadow-lg",
          success: "group[.toaster]:bg-primary group[.toaster]:text-primary-foreground",
          error: "group[.toaster]:bg-destructive group[.toaster]:text-destructive-foreground",
          warning: "group[.toaster]:bg-amber-600 group[.toaster]:text-foreground",
          info: "group[.toaster]:bg-blue-600 group[.toaster]:text-primary-foreground",
        },
      }}
    />
  );
}