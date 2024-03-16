import React, { useEffect, useState } from 'react'
import { Alert, Spinner } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/getErrorMessage';

const AuthCallback = () => {
  const { getUserInfo } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserInfo()
      .then(() => navigate('profile'))
      .catch(e => setError(getErrorMessage(e)))
      .finally(() => setIsChecking(false));
  }, [])

  if (isChecking) {
    return (
      <div className="d-flex justify-content-center mt-3">
        <Spinner animation="border" variant="secondary"/>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="d-grid gap-2 col-lg-6 col-10 m-auto">
        <Alert.Heading>Error during authentication</Alert.Heading>
        <p className="mb-3">{error}</p>

        <NavLink to="login" className="btn btn-outline-primary">Try again</NavLink>
      </Alert>
    )
  }

  return (
    <></>
  )
}

export default AuthCallback
