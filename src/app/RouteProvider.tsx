import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { AppRouter } from "./AppRouter";

export function RouteProvider({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter>{children}</AppRouter>
      </AuthProvider>
    </BrowserRouter>
  );
}