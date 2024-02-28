import React, { useState } from 'react'
import { Accordion, Offcanvas } from 'react-bootstrap'
import { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';
import ChangeEmailForm from './ProfileEditForms/ChangeEmailForm';
import ChangeNameForm from './ProfileEditForms/ChangeNameForm';
import ChangePassForm from './ProfileEditForms/ChangePassForm';
import { useAuth } from '../context/AuthContext';

type Props = {
  show: boolean;
  setShow: (open: boolean) => void;
};

const ProfileEditForm: React.FC<Props> = ({ show, setShow }) => {
  const { user } = useAuth();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleAccordionSelect = (eventKey: AccordionEventKey) => {
    if ((eventKey && !Array.isArray(eventKey) && eventKey !== activeKey)
      || eventKey === null) {
      setActiveKey(eventKey);
    }
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

      <Offcanvas.Body>
        <Accordion
          flush
          className="mb-3 w-100"
          activeKey={activeKey}
          onSelect={handleAccordionSelect}
        >
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <p className="mb-0 d-inline fw-medium me-1 text-primary">{'Username: '}</p>
              <p className="mb-0 d-inline">{user?.username}</p>
            </Accordion.Header>
            <Accordion.Body>
              <ChangeNameForm setActiveKey={setActiveKey}/>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <p className="mb-0 d-inline fw-medium me-1 text-primary">{'Email: '}</p>
              <p className="mb-0 d-inline">{user?.email}</p>
            </Accordion.Header>
            <Accordion.Body>
              <ChangeEmailForm setActiveKey={setActiveKey}/>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <p className="mb-0 fw-medium text-primary">Change password</p>
            </Accordion.Header>
            <Accordion.Body>
              <ChangePassForm setActiveKey={setActiveKey}/>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default ProfileEditForm
