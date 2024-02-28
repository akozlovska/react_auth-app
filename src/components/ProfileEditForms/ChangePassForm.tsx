import React, { useEffect, useState } from 'react'
import { Alert, Button, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../Inputs/PasswordInput';
import PassConfirmationInput from '../Inputs/PassConfirmationInput';
import { NewPasswordInput } from '../Inputs/NewPasswordInput';
import ErrorAlert from '../ErrorAlert';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { usePageError } from '../../hooks/usePageError';

type NewPasswordSubmit = {
  password: string,
  newPassword: string,
  confirmation: string,
};

type Props = {
  setActiveKey: (k: string | null) => void;
}

const ChangePassForm: React.FC<Props> = ({ setActiveKey }) => {
  const {
    handleSubmit,
    control,
    formState: {errors},
    clearErrors,
    reset,
  } = useForm<NewPasswordSubmit>({ reValidateMode: "onSubmit" });

  const [error, setError] = usePageError('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { changePassword } = useAuth();

  const onPassChange: SubmitHandler<NewPasswordSubmit> = async ({ password, newPassword }) => {
    setError('');
    setIsSubmitting(true);

    try {
      await changePassword(password, newPassword);
      setIsSubmitted(true);
    } catch (error) {
      setError(getErrorMessage(error));
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (isSubmitted) {
      const timeout = setTimeout(() => {
        setActiveKey(null);
        reset();
        setIsSubmitted(false);
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isSubmitted]);

  if (isSubmitting) {
    return (
      <div className="d-flex justify-content-center mt-3">
        <Spinner animation="border" variant="secondary"/>
      </div>
    )
  }

  return (
    <>
      {isSubmitted ? (
        <Alert variant="success">
          <p className="fw-semibold mb-1">Password changed successfully</p>
          <p className="mb-0">You will receive an email notifying of your password change</p>
        </Alert>
      ) : (
        <>
          <Form onSubmit={handleSubmit(onPassChange)}>
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Current password</Form.Label>
              <PasswordInput control={control} errors={errors} clearErrors={clearErrors} />
            </Form.Group>

            <Form.Group controlId="newPassword" className="mb-3">
              <Form.Label>New password</Form.Label>
              <NewPasswordInput control={control} errors={errors} clearErrors={clearErrors} />
            </Form.Group>

            <Form.Group controlId="confirmation" className="mb-3">
              <Form.Label>Confirm new password</Form.Label>
              <PassConfirmationInput control={control} errors={errors} clearErrors={clearErrors} />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="success" type="submit">Save</Button>
              <div className="vr mx-3" />
              <Button
                variant="outline-secondary"
                onClick={() => setActiveKey(null)}
              >
                Cancel
              </Button>
            </div>
          </Form>

          {!!error && (<ErrorAlert message={error} />)}
        </>
      )}
    </>
  )
}

export default ChangePassForm
