import React from 'react'
import { NavLink } from 'react-router-dom'

const HomePage = () => {
  return (
    <section className="text-center d-grid gap-2 col-lg-4 col-md-auto m-auto">
        <h1 className="mb-3 text-primary fw-bold fs-1">
            Welcome to the React Auth App
        </h1>
        <h3 className="mb-3 text-secondary">Please, sign in to continue</h3> 

        <NavLink to="/login" className="mb-3 btn btn-primary">Sign In</NavLink>

        <hr className="m-0" />

        <p className="mb-1 fs-5 text-secondary">Here for the first time?</p>

        <NavLink to="/register" className="btn btn-secondary">Sign Up</NavLink>
    </section>
  )
}

export default HomePage