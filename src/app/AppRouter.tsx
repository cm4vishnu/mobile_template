// File contents before modification (excluding the invalid lines)
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { LoadingRoute } from "./LoadingRoute";
import { NotFoundRoute } from "./NotFoundRoute";
import { routeRegistry, RouteConfig } from "./RouteRegistry";

export function AppRouter({ children }: { children?: React.ReactNode }) {
  const { loading, initialized } = useAuth();

  if (loading || !initialized) {
    return <LoadingRoute />;
  }

  return (
    <>
      {children}
      <Routes>
        {routeRegistry.map((route: RouteConfig) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.protected ? (
                <ProtectedRoute>
                  <route.Component />
                </ProtectedRoute>
              ) : (
                <PublicRoute>
                  <route.Component />
                </PublicRoute>
              )
            }
          />
        ))}
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </>
  );
]