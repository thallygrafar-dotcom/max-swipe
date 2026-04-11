import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import Login from "./pages/Login.tsx";
import SwipeMax from "./pages/SwipeMax";
import SwipeMaxAdmin from "./pages/SwipeMaxAdmin";
import { useAuth } from "./hooks/useAuth";
import Signup from "./pages/Signup";
import AdminUsers from "./pages/AdminUsers";
import ResetPassword from "./pages/ResetPassword";
import DTC from "./pages/Dtc";
import VslBuilder from "./pages/VslBuilder.tsx";
import PaginaAdvertorial from "./pages/PaginaAdvertorial";
import Ferramentas from "@/pages/Ferramentas";


function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white">
      Carregando...
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/swipe-max" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/swipe-max"
        element={
          <ProtectedRoute>
            <SwipeMax />
          </ProtectedRoute>
        }
      />

      <Route
  path="/signup"
  element={
    <PublicRoute>
      <Signup />
    </PublicRoute>
  }
/>

<Route path="/ferramentas" element={<Ferramentas />} />

<Route path="/vsl-builder" element={<VslBuilder />} />

<Route path="/pagina-advertorial" element={<PaginaAdvertorial />} />

<Route
  path="/admin-users"
  element={
    <ProtectedRoute>
      <AdminUsers />
    </ProtectedRoute>
  }
/>

<Route path="/reset-password" element={<ResetPassword />} />

<Route
  path="/dtc"
  element={
    <ProtectedRoute>
      <DTC />
    </ProtectedRoute>
  }
/>

      <Route
        path="/swipe-max-admin"
        element={
          <ProtectedRoute>
            <SwipeMaxAdmin />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}