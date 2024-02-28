import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'

const NonAuthorizedRoutes = () => {
  const { isAuthorized } = useAuth();

  if (isAuthorized) {
    return <Navigate to="/profile" replace />
  }

  return <Outlet />;
}

export default NonAuthorizedRoutes
