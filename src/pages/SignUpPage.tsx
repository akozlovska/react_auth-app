import React from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form'
import * as authService from '../api/services/authService';
import { PasswordInput } from '../components/Inputs/PasswordInput';
import EmailInput from '../components/Inputs/EmailInput';
import UsernameInput from '../components/Inputs/UsernameInput';
import ErrorAlert from '../components/ErrorAlert';
import { getErrorMessage } from '../utils/getErrorMessage';
import { usePageError } from '../hooks/usePageError';
import { SignUpData } from '../api/services/authService';
import { Spinner } from 'react-bootstrap';
import SocialButtons from '../components/SocialButtons';

const SignUpPage = () => {
  const {
    handleSubmit,
    control,
    formState: {errors},
    clearErrors,
  } = useForm<SignUpData>({ reValidateMode: "onSubmit" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = usePageError('');

  const onSignUp: SubmitHandler<SignUpData> = async (data) => {
    setError('');
    setIsSubmitting(true);

    try {
      await authService.signUp(data);
      setRegistered(true);
    } catch (error) {
      setError(getErrorMessage(error));
    }

    setIsSubmitting(false);
  };

  if (registered) {
    return (
      <Alert variant="success" className="d-grid gap-2 col-lg-6 col-10 m-auto">
        <Alert.Heading>Activate your email</Alert.Heading>
        <p>
          You have been registered.
          Now, check your email for a confirmation letter and follow the link in it to activate your account.
        </p>
      </Alert>
    )
  }

  return (
    <section className="border border-primary-subtle p-5 d-grid gap-2 col-xl-4 col-auto m-auto">
      <h1 className="mb-3 mb-sm-4 text-center">Sign Up</h1>

      <p className="m-0 mb-3 text-muted text-center">Sign up with your social media accounts</p>
      <SocialButtons />

      <p className="m-0 mb-3 text-muted form-divider">or</p>

      <Form onSubmit={handleSubmit(onSignUp)} className="mb-3">
        <Form.Group className="mb-2 mb-sm-3" controlId="username">
          <Form.Label className="visually-hidden">Username</Form.Label>
          <UsernameInput control={control} errors={errors} clearErrors={clearErrors} />
        </Form.Group>

        <Form.Group className="mb-2 mb-sm-3" controlId="email">
          <Form.Label className="visually-hidden">Email</Form.Label>
          <EmailInput control={control} errors={errors} clearErrors={clearErrors} />
        </Form.Group>

        <Form.Group className="mb-2 mb-sm-3" controlId="password">
            <Form.Label className="visually-hidden">Password</Form.Label>
            <PasswordInput control={control} errors={errors} clearErrors={clearErrors}/>
        </Form.Group>

        <div className="d-grid gap-2">
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
            Sign Up
          </Button>
        </div>
      </Form>

      {!!error && (<ErrorAlert message={error} />)}

      <p className="m-0 text-muted">
        Already have an account?
        <NavLink to="/login" className="link-primary link-underline-primary ms-1">Sign in</NavLink>
      </p>
    </section>
  )
}

export default SignUpPage
