import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

export default function RoleProtectedRoute({ children, role }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkRole() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!error && profile?.role === role) {
        setAllowed(true);
      }

      setLoading(false);
    }

    checkRole();
  }, [role]);

  if (loading) return <h2>Loading...</h2>;

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}