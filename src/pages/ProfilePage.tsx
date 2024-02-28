import React, { useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'
import ProfileEditForm from '../components/ProfileEditForm';
import { useExpense } from '../context/ExpenseContext';
import { getErrorMessage } from '../utils/getErrorMessage';
import { usePageError } from '../hooks/usePageError';
import ErrorAlert from '../components/ErrorAlert';
import { Outlet } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth()!;
  const { getAllCategories, getAllExpenses } = useExpense();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = usePageError('');

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    getAllCategories(user!.id)
      .catch(err => setError(getErrorMessage(err)))
  }, []);

  useEffect(() => {
    getAllExpenses(user!.id)
      .then(() => setIsLoading(false))
      .catch(err => setError(getErrorMessage(err)));
  }, [])

  return (
    <section className="pt-4 w-100 mb-5">
      <div className="d-flex justify-content-between flex-wrap flex-sm-nowrap">
        <div>
          <h1>{user?.username}</h1>
          <h5 className="text-secondary">{user?.email}</h5>
        </div>

        <Button
          variant="outline-primary"
          className="align-self-center"
          onClick={() => setIsEdit(true)}
        >
          Edit profile
        </Button>
      </div>

      <hr />

      {isLoading ? (
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="border" variant="secondary"/>
        </div>
      ) : (
        <Outlet />
      )}

      {!!error && (<ErrorAlert message={error} />)}
      
      <ProfileEditForm show={isEdit} setShow={setIsEdit} />
    </section>
  )
}

export default ProfilePage
