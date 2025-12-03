import React from "react";
import { Route, Redirect } from "wouter";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface PrivateRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ path, component: Component }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/admin/login" />;
  }

  return <Route path={path} component={Component} />;
};
