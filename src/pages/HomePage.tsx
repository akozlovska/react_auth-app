import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const { isAuthorized } = useAuth();

  return (
    <section className="text-center d-grid gap-2 col-lg-6 col-md-auto m-auto">
      <h1 className="mb-2 text-primary fw-bold fs-1">
        Welcome to the Accounting App
      </h1>

      {!isAuthorized && (
        <div className="w-50 mx-auto">
          <h3 className="mb-2  text-primary-emphasis">Please, sign in to continue</h3>
          <NavLink to="/login" className="mx-auto mb-3 btn btn-primary">Sign In</NavLink>
          <hr className="m-0 mb-2" />
          <p className="mb-2 fs-5 text-secondary">Here for the first time?</p>
          <NavLink to="/register" className="mx-auto btn btn-secondary">Sign Up</NavLink>
        </div>
      )}
    </section>
  )
}

export default HomePage
