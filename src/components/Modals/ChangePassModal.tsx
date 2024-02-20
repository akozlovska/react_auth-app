import React, { useState } from 'react'
import { Alert, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../Inputs/PasswordInput';
import PassConfirmationInput from '../Inputs/PassConfirmationInput';
import { NewPasswordInput } from '../Inputs/NewPasswordInput';
import ErrorAlert from '../ErrorAlert';
import { getErrorMessage } from '../../utils/getErrorMessage';

type NewPasswordSubmit = {
    password: string,
    newPassword: string,
    confirmation: string,
};

type Props = {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
};

const ChangePassModal: React.FC<Props> = ({ isModalOpen, setIsModalOpen }) => {
    const {
        handleSubmit, 
        control, 
        formState: {errors}, 
        clearErrors 
    } = useForm<NewPasswordSubmit>({ reValidateMode: "onSubmit" });

    const [submitErr, setSubmitErr] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { changePassword } = useAuth();

    const onPassChange: SubmitHandler<NewPasswordSubmit> = async ({ password, newPassword }) => {
        setSubmitErr('');

        try {
            await changePassword(password, newPassword);
            setIsSubmitted(true);
        } catch (error) {
            setSubmitErr(getErrorMessage(error));
        }
    };

  return (
    <Modal
        show={isModalOpen} 
        onHide={() => setIsModalOpen(false)}
        centered
    >
        <Modal.Header closeButton>
            <Modal.Title>Change password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onPassChange)}>
                <Form.Group controlId="formPassword">
                    <Form.Label>Current password</Form.Label>
                    <PasswordInput control={control} errors={errors} clearErrors={clearErrors} />
                </Form.Group>

                <Form.Group controlId="formNewPassword">
                    <Form.Label>New password</Form.Label>
                    <NewPasswordInput control={control} errors={errors} clearErrors={clearErrors} />
                </Form.Group>

                <Form.Group controlId="formConfirmation">
                    <Form.Label>Confirmation</Form.Label>
                    <PassConfirmationInput control={control} errors={errors} clearErrors={clearErrors} />
                </Form.Group>

                <div className="mb-3">
                    <Button variant="success" type="submit">Save</Button>
                    <div className="vr" />
                    <Button variant="outline-secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                </div>
            </Form>

            {isSubmitted && (
                <Alert variant="success">
                    <Alert.Heading>Password changed successfully</Alert.Heading>
                    <p>You will receive an email notifying of your password change</p>
                </Alert>
            )}

            {!!submitErr && (<ErrorAlert message={submitErr} />)}
        </Modal.Body>
    </Modal>
  )
}

export default ChangePassModal