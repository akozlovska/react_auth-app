import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { SubmitHandler, useForm } from 'react-hook-form';
import UsernameInput from '../Inputs/UsernameInput';
import { useAuth } from '../../context/AuthContext';
import ErrorAlert from '../ErrorAlert';
import { getErrorMessage } from '../../utils/getErrorMessage';

type UsernameSubmit = {
    username: string;
};

type Props = {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
};

const ChangeNameModal: React.FC<Props> = ({ isModalOpen, setIsModalOpen }) => {
    const {
        handleSubmit, 
        control, 
        formState: {errors}, 
        clearErrors 
      } = useForm<UsernameSubmit>({ reValidateMode: "onSubmit" });

      const [submitErr, setSubmitErr] = useState('');

      const { changeUsername } = useAuth();

      const onNameChange: SubmitHandler<UsernameSubmit> = async ({ username }) => {
        setSubmitErr('');
    
        try {
          await changeUsername(username);
          setIsModalOpen(false);
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
            <Modal.Title>Change username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onNameChange)}>
                <Form.Group controlId="formUsername">
                    <Form.Label>New username</Form.Label>
                    <UsernameInput control={control} errors={errors} clearErrors={clearErrors} />
                </Form.Group>
                <div className="mb-3">
                    <Button variant="success" type="submit">Save</Button>
                    <div className="vr" />
                    <Button variant="outline-secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                </div>
            </Form>

            {!!submitErr && (<ErrorAlert message={submitErr} />)}
        </Modal.Body>
    </Modal>
  )
}

export default ChangeNameModal