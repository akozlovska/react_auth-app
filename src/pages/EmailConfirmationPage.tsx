import React, { useEffect, useState } from 'react'
import { Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/getErrorMessage';

const EmailConfirmationPage = () => {
    const { type } = useParams();
    console.log(type);
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const id = searchParams.get('id');
    const newEmail = searchParams.get('email');

    const { activate, changeEmail, confirmReset } = useAuth();

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [confirmationErr, setConfirmationErr] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        switch(type) {
            case 'activate':
                if (token && id) {
                    activate(token, id)
                        .then(() => navigate('/profile'))
                        .catch((e) => setConfirmationErr(getErrorMessage(e)))
                }
                break;
            case 'reset-password':
                if (token && id) {
                    confirmReset(token, id)
                        .then(() => navigate('/reset-password'))
                        .catch((e) => setConfirmationErr(getErrorMessage(e)))
                }
                break;
            case 'change-email':
                if (token && id && newEmail) {
                    changeEmail(token, id, newEmail)
                        .then(() => navigate('/profile'))
                        .catch((e) => setConfirmationErr(getErrorMessage(e)))
                }
                break;
            default:
                setIsConfirmed(false);
        }

        setIsChecking(false);
    }, []);

    if (!token || !id) {
        return (
            <Alert variant="danger">
                <Alert.Heading>Not authorized</Alert.Heading>
                <p>You have not confirmed your email</p>
            </Alert>
        )
    }

    if (token && id && isChecking) {
        return (
            <Spinner animation="border" variant="primary" />
        );
    }

  return (
    <>
        {!isConfirmed && (
            <Alert variant="danger">
                <Alert.Heading>Failed confirmation</Alert.Heading>
                <p>
                    The process of your email confirmation has failed.
                </p>
                {!!confirmationErr && (
                    <p>
                        {`Reason: ${confirmationErr}`}
                    </p>
                )}
            </Alert>
        )}
    </>
  )
}

export default EmailConfirmationPage