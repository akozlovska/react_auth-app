import React, { useEffect, useState } from 'react'
import { Alert, Button, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../Inputs/PasswordInput';
import NewEmailInput from '../Inputs/NewEmailInput';
import ErrorAlert from '../ErrorAlert';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { usePageError } from '../../hooks/usePageError';

type NewEmailSubmit = {
  password?: string,
  newEmail: string,
};

type Props = {
  setActiveKey: (k: string | null) => void;
  isPassRequired: boolean;
}

const ChangeEmailForm: React.FC<Props> = ({ setActiveKey, isPassRequired }) => {
  const {
    handleSubmit,
    control,
    formState: {errors},
    clearErrors,
    reset,
  } = useForm<NewEmailSubmit>({ reValidateMode: "onSubmit" });

  const [error, setError] = usePageError('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { requestEmailChange } = useAuth();

  const onEmailChange: SubmitHandler<NewEmailSubmit> = async ({ password, newEmail }) => {
    setError('');
    setIsSubmitting(true);

    try {
      await requestEmailChange(password, newEmail);
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
          <p className="fw-semibold mb-1">Confirm your new email</p>
          <p className="mb-0">Check your new email and follow the link to confirm changes</p>
        </Alert>
      ) : (
        <>
          <Form onSubmit={handleSubmit(onEmailChange)}>
            {isPassRequired && (
              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Your password</Form.Label>
                <PasswordInput control={control} errors={errors} clearErrors={clearErrors} />
              </Form.Group>
            )}

            <Form.Group controlId="newEmail" className="mb-3">
              <Form.Label>New email</Form.Label>
              <NewEmailInput control={control} errors={errors} clearErrors={clearErrors} />
            </Form.Group>

            <div className="d-flex justify-content-end mb-3">
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

export default ChangeEmailForm
