// File contents before modification (excluding the invalid lines)
export interface RouteConfig {
  path: string;
  Component: React.ComponentType<Record<string, unknown>>;
  protected: boolean;
}

export const routeRegistry: RouteConfig[] = [
  {
    path: "/",
    Component: () => <div>Home (Feature Placeholder)</div>,
    protected: false,
  },
  {
    path: "/settings",
    Component: () => <div>Settings (Feature Placeholder)</div>,
    protected: true,
  },
  {
    path: "/profile",
    Component: () => <div>Profile (Feature Placeholder)</div>,
    protected: true,
  },
]