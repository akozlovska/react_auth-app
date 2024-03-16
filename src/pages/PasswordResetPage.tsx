import React, { useState } from 'react'
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import PassConfirmationInput from '../components/Inputs/PassConfirmationInput';
import { PasswordInput } from '../components/Inputs/PasswordInput';
import { getErrorMessage } from '../utils/getErrorMessage';
import { usePageError } from '../hooks/usePageError';

type NewPasswordSubmit = {
  password: string;
  confirmation: string;
}

const PasswordResetPage = () => {
  const { email } = useParams();

  const {
    handleSubmit,
    control,
    formState: {errors},
    clearErrors,
  } = useForm<NewPasswordSubmit>({ reValidateMode: "onSubmit" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = usePageError('');
  const { resetPassword } = useAuth();

  const onSubmit: SubmitHandler<NewPasswordSubmit> = async (data) => {
    setError('');
    setIsSubmitting(true);

    if (email) {
      try {
        await resetPassword(data.password, email);
        setIsSubmitted(true);
      } catch (error) {
        setError(getErrorMessage(error));
      }
    }

    setIsSubmitting(false);
  };

  if (!email) {
    return (
      <div className="d-grid gap-2 col-lg-6 col-10 m-auto">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Not authorized</Alert.Heading>
          <p>You have not confirmed your email</p>
        </Alert>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="d-grid gap-2 col-lg-6 col-10 m-auto">
        <Alert variant="success" className="text-center">
          <Alert.Heading>Successful password reset</Alert.Heading>
          <p>You have successfully reset your password.</p>
          <Alert.Link as={Link} to="/login">
            Login with your new password to authorize.
          </Alert.Link>
        </Alert>
      </div>
    );
  }

  return (
    <section className="border border-primary-subtle p-5 d-grid gap-2 col-lg-6 col-10 m-auto">
      <h1 className="mb-3 mb-sm-4 text-center">Change password</h1>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-2 mb-sm-3" controlId="password">
          <Form.Label>New password</Form.Label>
          <PasswordInput control={control} errors={errors} clearErrors={clearErrors}/>
        </Form.Group>

        <Form.Group className="mb-2 mb-sm-3" controlId="confirmation">
          <Form.Label>Confirm password</Form.Label>
          <PassConfirmationInput control={control} errors={errors} clearErrors={clearErrors}/>
        </Form.Group>

        <div className="d-grid gap-2 mb-3">
          <Button variant="primary" type="submit">
            {isSubmitting && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-3"
              />
            )}
            Change password
          </Button>
        </div>
      </Form>

      {!!error && (<ErrorAlert message={error} />)}
    </section>
  )
}

export default PasswordResetPage
