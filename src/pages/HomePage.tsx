import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const { isAuthorized } = useAuth();

  return (
    <section className="text-center d-grid gap-2 col-lg-8 col-10 m-auto">
      <h1 className="mb-5 display-1">
        Welcome to the Accounting App
      </h1>

      {!isAuthorized && (
        <div className="mx-auto row w-75">
          <div className="col">
            <p className="mb-3 fs-5">Sign in to continue</p>
            <NavLink to="/login" className="mx-auto btn btn-primary">Sign In</NavLink>
          </div>
          <div className="vr p-0 mx-3 d-none d-sm-block"></div>
          <div className="col">
            <p className="mb-3 fs-5">Here for the first time?</p>
            <NavLink to="/register" className="mx-auto btn btn-secondary">Sign Up</NavLink>
          </div>
        </div>
      )}
    </section>
  )
}

export default HomePage
