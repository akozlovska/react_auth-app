import React, { useState } from 'react'
import { Alert, Button, Spinner } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as authService from '../api/services/authService';
import EmailInput from './Inputs/EmailInput';
import ErrorAlert from './ErrorAlert';
import { getErrorMessage } from '../utils/getErrorMessage';
import { usePageError } from '../hooks/usePageError';

type EmailSubmit = {
  email: string;
};

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
};

const ForgotPassModal: React.FC<Props> = ({ isModalOpen, setIsModalOpen }) => {
  const {
    handleSubmit,
    control,
    formState: {errors},
    clearErrors
  } = useForm<EmailSubmit>({ reValidateMode: "onSubmit" });

  const [error, setError] = usePageError('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit: SubmitHandler<EmailSubmit> = async (data) => {
    setError('');
    setIsSubmitting(true);

    try {
      await authService.requestPasswordReset(data.email);
      setIsSubmitted(true);
    } catch (error) {
      setError(getErrorMessage(error));
    }

    setIsSubmitting(false);
  };

  return (
    <Modal
      show={isModalOpen}
      onHide={() => setIsModalOpen(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Reset your password</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isSubmitted ? (
          <Alert variant="success">
            <Alert.Heading>Check your email</Alert.Heading>
            <p>
              You will find a link to reset your password in your email.
            </p>
          </Alert>
        ) : (
          <>
            <p>Enter your email and we will send you a link to reset your password</p>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-2 mb-sm-3" controlId="email">
                <EmailInput control={control} errors={errors} clearErrors={clearErrors}/>
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
                  Send email
                </Button>
              </div>
            </Form>

            {!!error && (<ErrorAlert message={error} />)}
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ForgotPassModal
