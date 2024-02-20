import React, { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import PassConfirmationInput from '../components/Inputs/PassConfirmationInput';
import { PasswordInput } from '../components/Inputs/PasswordInput';
import { getErrorMessage } from '../utils/getErrorMessage';

type NewPasswordSubmit = {
    password: string;
    confirmation: string;
}

const PasswordResetPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    handleSubmit, 
    control, 
    formState: {errors}, 
    clearErrors,
  } = useForm<NewPasswordSubmit>({ reValidateMode: "onSubmit" });

  const [resetErr, setResetErr] = useState('');
  const { isAuthorized, resetPassword } = useAuth();

  const onSubmit: SubmitHandler<NewPasswordSubmit> = async (data) => {
    setResetErr('');

    try {
      await resetPassword(data.password);
      setSearchParams({ success: 'true' });
    } catch (error) {
        setResetErr(getErrorMessage(error));
    }
  };

  if (!isAuthorized) {
      return (
        <Alert variant="danger">
            <Alert.Heading>Not authorized</Alert.Heading>
            <p>You have not confirmed your email</p>
        </Alert>
      );
  }

  if (searchParams.get('success') === 'true') {
    return (
        <Alert variant="success">
            <Alert.Heading>Successful password reset</Alert.Heading>
            <p>You have successfully reset your password.</p>
            <Alert.Link as={Link} to="/login">
                Login with your new password to authorize.
            </Alert.Link>
        </Alert>
    );
  }

  return (
    <section className="border border-primary-subtle px-4 px-md-5 py-3 py-sm-4">
        <h1 className="mb-3 mb-sm-4">Change password</h1>

        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-2 mb-sm-3" controlId="formPassword">
                <Form.Label>New password</Form.Label>
                <PasswordInput control={control} errors={errors} clearErrors={clearErrors}/>
            </Form.Group>

            <Form.Group className="mb-2 mb-sm-3" controlId="formConfirmation">
                <Form.Label>Confirm password</Form.Label>
                <PassConfirmationInput control={control} errors={errors} clearErrors={clearErrors}/>
            </Form.Group>

            <div className="d-grid gap-2 mb-3">
                <Button variant="primary" type="submit">
                    Change password 
                </Button>
            </div>
        </Form>

        {!!resetErr && (<ErrorAlert message={resetErr} />)}
    </section>
  )
}

export default PasswordResetPage