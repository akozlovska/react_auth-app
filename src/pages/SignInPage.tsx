import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SubmitHandler, useForm } from 'react-hook-form';
import ForgotPassModal from '../components/ForgotPassModal';
import { PasswordInput } from '../components/Inputs/PasswordInput';
import EmailInput from '../components/Inputs/EmailInput';
import ErrorAlert from '../components/ErrorAlert';
import { getErrorMessage } from '../utils/getErrorMessage';
import { usePageError } from '../hooks/usePageError';
import { SignInData } from '../api/services/authService';
import { Spinner } from 'react-bootstrap';

const SignInPage = () => {
  const {
    handleSubmit,
    control,
    formState: {errors},
    clearErrors
    } = useForm<SignInData>({ reValidateMode: "onSubmit" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = usePageError('');

  const { signIn } = useAuth();

  const navigate = useNavigate();

  const onSignIn: SubmitHandler<SignInData> = async (data) => {
    setError('');
    setIsSubmitting(true);

    try {
      await signIn(data);
      navigate('/profile');
    } catch (error) {
      setError(getErrorMessage(error));
    }

    setIsSubmitting(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="border border-primary-subtle p-5 d-grid gap-2 col-lg-4 col-sm-auto m-auto">
      <h1 className="mb-3 mb-sm-4">Sign in</h1>

      <Form onSubmit={handleSubmit(onSignIn)}>
        <Form.Group className="mb-2 mb-sm-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <EmailInput control={control} errors={errors} clearErrors={clearErrors}/>
        </Form.Group>

        <Form.Group className="mb-2 mb-sm-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <PasswordInput control={control} errors={errors} clearErrors={clearErrors}/>
        </Form.Group>

        <div className="d-grid gap-2 mb-3">
          <Button variant="primary" type="submit" disabled={isSubmitting}>
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
            Sign In
          </Button>
        </div>

        <Form.Text muted>
          Don't have an account?
          <NavLink to="/register" className="link-primary link-underline-primary ms-1">Sign up</NavLink>
        </Form.Text>

        <hr />

        <div className="d-grid gap-2">
          <Button
            variant="outline-primary"
            onClick={() => setIsModalOpen(true)}
            size="sm"
          >
            Forgot your password?
          </Button>
        </div>
      </Form>

      {!!error && (<ErrorAlert message={error} />)}

      <ForgotPassModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </section>
  )
}

export default SignInPage
