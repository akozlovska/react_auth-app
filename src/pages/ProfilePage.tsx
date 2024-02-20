import React, { useState } from 'react'
import { Button, Stack } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'
import ChangeEmailModal from '../components/Modals/ChangeEmailModal';
import ChangeNameModal from '../components/Modals/ChangeNameModal';
import ChangePassModal from '../components/Modals/ChangePassModal';

const ProfilePage = () => {
    const { user } = useAuth();

    const [isNameChanging, setIsNameChanging] = useState(false);
    const [isEmailChanging, setIsEmailChanging] = useState(false);
    const [isPassChanging, setIsPassChanging] = useState(false);

  return (
    <section>
        <h1>Profile</h1>

        <Stack gap={3}>
            <div>
                <p>Username:</p>
                {user?.username}
                <Button 
                    variant="outline-primary"
                    onClick={() => setIsNameChanging(true)}
                >
                    Change username
                </Button>
            </div>
            <div>
                <p>Email:</p>
                {user?.email}
                <Button 
                    variant="outline-primary"
                    onClick={() => setIsEmailChanging(true)}
                >
                    Change email
                </Button>
            </div>
            <div>
                <Button 
                    variant="outline-primary"
                    onClick={() => setIsPassChanging(true)}
                >
                    Change password
                </Button>
            </div>
        </Stack>

        <ChangeNameModal isModalOpen={isNameChanging} setIsModalOpen={setIsNameChanging} />
        <ChangeEmailModal isModalOpen={isEmailChanging} setIsModalOpen={setIsEmailChanging} />
        <ChangePassModal isModalOpen={isPassChanging} setIsModalOpen={setIsPassChanging} />
    </section>
  )
}

export default ProfilePage