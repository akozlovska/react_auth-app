import React, { useState } from 'react'
import { Accordion, Button, Modal, Offcanvas, Spinner } from 'react-bootstrap'
import { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';
import ChangeEmailForm from './ProfileEditForms/ChangeEmailForm';
import ChangeNameForm from './ProfileEditForms/ChangeNameForm';
import ChangePassForm from './ProfileEditForms/ChangePassForm';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from './ErrorAlert';
import { usePageError } from '../hooks/usePageError';
import { getErrorMessage } from '../utils/getErrorMessage';
import { useNavigate } from 'react-router-dom';
import SocialAccounts from './SocialAccounts';

type Props = {
  show: boolean;
  setShow: (open: boolean) => void;
};

const ProfileEditForm: React.FC<Props> = ({ show, setShow }) => {
  const { user, deleteUser } = useAuth()!;
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleAccordionSelect = (eventKey: AccordionEventKey) => {
    if ((eventKey && !Array.isArray(eventKey) && eventKey !== activeKey)
      || eventKey === null) {
      setActiveKey(eventKey);
    }
  }

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = usePageError('');

  const navigate = useNavigate();

  const handleDelete = async(e: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteError('');
    setIsDeleting(true);

    try {
      await deleteUser();
      setConfirmDelete(false);
      navigate('/');
    } catch (error) {
      setDeleteError(getErrorMessage(error));
    }

    setIsDeleting(false);
  }

  return (
    <Offcanvas
      show={show}
      onHide={() => setShow(false)}
      placement="end"
    >
      <Offcanvas.Header closeButton className="my-4">
        <Offcanvas.Title as={'h2'}>Edit profile</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column justify-content-between">
        <div className="mb-3">
          <Accordion
            flush
            className="mb-5 w-100"
            activeKey={activeKey}
            onSelect={handleAccordionSelect}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <p className="mb-0 fw-medium">
                  Change username
                </p>
              </Accordion.Header>
              <Accordion.Body>
                <p className="">
                  {`Current username: `}
                  <b>{user?.username}</b>
                </p>
                <ChangeNameForm setActiveKey={setActiveKey}/>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <p className="mb-0 d-inline fw-medium me-3">
                  Change email
                </p>
              </Accordion.Header>
              <Accordion.Body>
                <p className="">
                  {`Current email: `}
                  <b>{user?.email}</b>
                </p>
                <ChangeEmailForm
                  setActiveKey={setActiveKey}
                  isPassRequired={user?.authType === 'local'}
                />
              </Accordion.Body>
            </Accordion.Item>

            {user?.authType === 'local' && (
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  <p className="mb-0 fw-medium">
                    Change password
                  </p>
                </Accordion.Header>
                <Accordion.Body>
                  <ChangePassForm setActiveKey={setActiveKey}/>
                </Accordion.Body>
              </Accordion.Item>
            )}
          </Accordion>

          <h3 className="mb-3">Connected social accounts</h3>

          <SocialAccounts />
        </div>

        <Button
          variant="outline-danger"
          onClick={() => setConfirmDelete(true)}
          className="align-self-end"
        >
          Delete profile
        </Button>
      </Offcanvas.Body>

      <Modal show={confirmDelete} onHide={() => setConfirmDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>You want to delete your profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          All your personal data, including all your expenses will be deleted. Do you want to delete your profile?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            {isDeleting && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-3"
              />
            )}
            Delete
          </Button>
          <Button variant="outline-secondary" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
        </Modal.Footer>
        {!!deleteError && (<ErrorAlert message={deleteError} />)}
      </Modal>
    </Offcanvas>
  )
}

export default ProfileEditForm
