import React, { useState } from 'react'
import { Alert, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../Inputs/PasswordInput';
import NewEmailInput from '../Inputs/NewEmailInput';
import ErrorAlert from '../ErrorAlert';
import { getErrorMessage } from '../../utils/getErrorMessage';

type NewEmailSubmit = {
    password: string,
    newEmail: string,
};

type Props = {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
};

const ChangeEmailModal: React.FC<Props> = ({ isModalOpen, setIsModalOpen }) => {
    const {
        handleSubmit, 
        control, 
        formState: {errors}, 
        clearErrors 
    } = useForm<NewEmailSubmit>({ reValidateMode: "onSubmit" });

    const [submitErr, setSubmitErr] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { requestEmailChange } = useAuth();

    const onEmailChange: SubmitHandler<NewEmailSubmit> = async ({ password, newEmail }) => {
        setSubmitErr('');

        try {
            await requestEmailChange(password, newEmail);
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
            <Form onSubmit={handleSubmit(onEmailChange)}>
                <Form.Group controlId="formPassword">
                    <Form.Label>Your password</Form.Label>
                    <PasswordInput control={control} errors={errors} clearErrors={clearErrors} />
                </Form.Group>

                <Form.Group controlId="formNewEmail">
                    <Form.Label>New email</Form.Label>
                    <NewEmailInput control={control} errors={errors} clearErrors={clearErrors} />
                </Form.Group>

                <div className="mb-3">
                    <Button variant="success" type="submit">Save</Button>
                    <div className="vr" />
                    <Button variant="outline-secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                </div>
            </Form>

            {isSubmitted && (
                <Alert variant="success">
                    <Alert.Heading>Confirm your new email</Alert.Heading>
                    <p>Check your new email and follow the link to confirm changes</p>
                </Alert>
            )}

            {!!submitErr && (<ErrorAlert message={submitErr} />)}
        </Modal.Body>
    </Modal>
  )
}

export default ChangeEmailModal