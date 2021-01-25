// pages/secret.js

import React from 'react'
import { useAuth } from '@/hooks/useAuth';


const Secret = () => {
  const { isAuthenticated, session, loading, signIn, signOut } = useAuth();
  if (loading) return "authorizing..."
  if (!loading && !isAuthenticated) return <p>Access Denied</p>;

  return (
    <div>
      {/* {(session.user.email && session.user.name) && ( */}
      { isAuthenticated && (
        process.env.SECRET
      )}
    </div>
  )
}

export default Secret
