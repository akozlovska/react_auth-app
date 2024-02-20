import React from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form'
import { SignUpData } from '../context/AuthContext';
import * as authService from '../api/services/authService';
import { PasswordInput } from '../components/Inputs/PasswordInput';
import EmailInput from '../components/Inputs/EmailInput';
import UsernameInput from '../components/Inputs/UsernameInput';
import ErrorAlert from '../components/ErrorAlert';
import { getErrorMessage } from '../utils/getErrorMessage';

const SignUpPage = () => {
  const {
    handleSubmit, 
    control, 
    formState: {errors}, 
    clearErrors 
  } = useForm<SignUpData>({ reValidateMode: "onSubmit" }); 

  const [registered, setRegistered] = useState(false);

  const [signUpErr, setSignUpErr] = useState('');

  const onSignUp: SubmitHandler<SignUpData> = async (data) => {
      setSignUpErr('');

      try {
        await authService.signUp(data);
        setRegistered(true);
      } catch (error) {
        setSignUpErr(getErrorMessage(error));
      }
  };

  if (registered) {
    return (
      <Alert variant="success">
        <Alert.Heading>Activate your email</Alert.Heading>
        <p>
          You have been registered. 
          Now, check your email for a confirmation letter and follow the link in it to activate your account.
        </p>
      </Alert>
    )
  }

  return (
    <section className="border border-primary-subtle p-5 d-grid gap-2 col-lg-4 col-sm-auto m-auto">
      <h1 className="mb-3 mb-sm-4">Sign up</h1>

      <Form onSubmit={handleSubmit(onSignUp)}>
        <Form.Group className="mb-2 mb-sm-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <UsernameInput control={control} errors={errors} clearErrors={clearErrors} />
        </Form.Group>

        <Form.Group className="mb-2 mb-sm-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <EmailInput control={control} errors={errors} clearErrors={clearErrors} />
        </Form.Group>

        <Form.Group className="mb-2 mb-sm-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <PasswordInput control={control} errors={errors} clearErrors={clearErrors}/>
        </Form.Group>

        <div className="d-grid gap-2 mb-3">
          <Button variant="primary" type="submit">
              Sign Up 
          </Button>
        </div>
        
        <Form.Text muted>
          Already have an account?
          <NavLink to="/login" className="link-primary link-underline-primary ms-1">Sign in</NavLink>
        </Form.Text>
      </Form>

      {!!signUpErr && (<ErrorAlert message={signUpErr} />)}
    </section>
  )
}

export default SignUpPage