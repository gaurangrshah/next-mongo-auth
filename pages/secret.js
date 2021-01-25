// pages/secret.js

import React from "react";
import { useAuth } from "@/hooks/useAuth";

const Secret = () => {
  const { isAuthenticated, session, loading, signIn, signOut } = useAuth();

  return (
    <div style={{ paddingTop: "12em", margin: "0 auto", textAlign: "center" }}>
      {/* {(session.user.email && session.user.name) && ( */}
      {loading && "authorizing..."}
      {!loading && !isAuthenticated && "Access Denied"}
      {!loading && isAuthenticated && process.env.NEXT_PUBLIC_SECRET}
    </div>
  );
};

export default Secret;
