import React, { useEffect, useState } from 'react'
import { Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/getErrorMessage';

const EmailConfirmationPage = () => {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const id = searchParams.get('id') || '';
  const newEmail = searchParams.get('email') || '';

  const { activate, changeEmail, confirmReset } = useAuth();

  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    switch(type) {
      case 'activate':
        if (token && id) {
          activate(token, id)
            .then(() => navigate('/profile', { replace: true }))
            .catch((e) => setError(getErrorMessage(e)))
        }
        break;
      case 'reset-password':
        if (token && id) {
          confirmReset(token, id)
            .then((email) => navigate(`/reset-password/${email}`, { replace: true }))
            .catch((e) => setError(getErrorMessage(e)))
        }
        break;
      case 'change-email':
        if (token && id && newEmail) {
          changeEmail(token, id, newEmail)
            .then(() => navigate('/profile', { replace: true }))
            .catch(e => setError(getErrorMessage(e)))
        }
        break;
      default:
        break;
    }

    setIsChecking(false);
  }, []);

  if (!token || !id) {
    return (
      <Alert variant="danger" className="d-grid gap-2 col-lg-6 col-10 m-auto text-center">
        <Alert.Heading>Not authorized</Alert.Heading>
        <p>You have not confirmed your email</p>
      </Alert>
    )
  }

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
        <Alert.Heading>Failed confirmation</Alert.Heading>
        <p>
          The process of your email confirmation has failed.
          <br />
          {`Reason: ${error}`}
        </p>
      </Alert>
    );
  }

  return (
    <></>
  )
}

export default EmailConfirmationPage
