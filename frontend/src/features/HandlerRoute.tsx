import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./AuthStore";

type Props = {
  authCheck?: boolean;
};

export function HandleRoute({ authCheck = true }: Props) {
  const user = useAuthStore((s: any) => s.user);
  const authReady = useAuthStore((s: any) => s.authReady);
  const init = useAuthStore((s: any) => s.init);
  const location = useLocation();

  useEffect(() => {
    if (!authReady) {
      init();
    }
  }, [authReady, init]);

  if (!authReady) {
    return null;
  }

  if (authCheck && !user) {
    return <Navigate to="/login" replace />;
  }

  if (user && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}