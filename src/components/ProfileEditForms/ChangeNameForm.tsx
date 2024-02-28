import React, { useEffect, useState } from 'react'
import { Alert, Button, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { SubmitHandler, useForm } from 'react-hook-form';
import UsernameInput from '../Inputs/UsernameInput';
import { useAuth } from '../../context/AuthContext';
import ErrorAlert from '../ErrorAlert';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { usePageError } from '../../hooks/usePageError';

type UsernameSubmit = {
  username: string;
};

type Props = {
  setActiveKey: (k: string | null) => void;
}

const ChangeNameForm: React.FC<Props> = ({ setActiveKey }) => {
  const {
    handleSubmit,
    control,
    formState: {errors},
    clearErrors,
    reset,
  } = useForm<UsernameSubmit>({ reValidateMode: "onSubmit" });

  const [error, setError] = usePageError('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { changeUsername } = useAuth();

  const onNameChange: SubmitHandler<UsernameSubmit> = async ({ username }) => {
    setError('');
    setIsSubmitting(true);

    try {
      await changeUsername(username);
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
    );
  }

  return (
    <>
      {isSubmitted ? (
        <Alert variant="success">
          <p className="mb-1 text-center">Username changed successfully</p>
        </Alert>
      ) : (
        <>
          <Form onSubmit={handleSubmit(onNameChange)}>
            <Form.Group controlId="newUsername" className="mb-3">
              <Form.Label>New username</Form.Label>
              <UsernameInput control={control} errors={errors} clearErrors={clearErrors} />
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

export default ChangeNameForm
