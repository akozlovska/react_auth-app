import React, { useState } from 'react'
import { Button, Card, Form, Modal, Spinner, Stack } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { usePageError } from '../hooks/usePageError';
import { Category } from '../types/Category';
import { getErrorMessage } from '../utils/getErrorMessage';
import ErrorAlert from './ErrorAlert';

type ItemProps = {
  category: Category;
}

const CategoriesItem: React.FC<ItemProps> = ({ category }) => {
  const { changeCategory, deleteCategory, getAllExpenses } = useExpense();
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteError, setDeleteError] = usePageError('');
  const [editError, setEditError] = usePageError('');

  const navigate = useNavigate();
  const encodedCategory = category.name.replace(/\s/g, '+');

  const handleDelete = async(id: number) => {
    setDeleteError('');
    setIsSubmitting(true);

    try {
      await deleteCategory(id);
      await getAllExpenses();
      setConfirmDelete(false);
    } catch (error) {
      setDeleteError(getErrorMessage(error));
    }

    setIsSubmitting(false);
  }

  const {
    handleSubmit,
    control,
    formState: {errors},
    clearErrors,
  } = useForm<{ name: string }>({ reValidateMode: "onSubmit" });

  const handleChange:SubmitHandler<{ name: string }> = async({ name }) => {
    setEditError('');
    setIsSubmitting(true);

    try {
      await changeCategory(category.id, name.trim());
      await getAllExpenses();
      setIsEdit(false);
    } catch (error) {
      setEditError(getErrorMessage(error));
    }

    setIsSubmitting(false);
  }

  return (
    <Card body>
      {isEdit ? (
        <Form onSubmit={handleSubmit(handleChange)}>
          <div className="d-flex justify-content-between flex-wrap flex-sm-nowrap">
            <Form.Group controlId="category">
              <Form.Label visuallyHidden>Change category</Form.Label>
              <Controller control={control} name="name"
                defaultValue={category.name}
                rules={{
                pattern: {
                  value: /\S+/,
                  message: 'You need to enter a valid category name'
                }
                }}
                render={({ field: { onChange, value, ref } }) => (
                  <Form.Control
                    onChange={(value) => {onChange(value); clearErrors(['name'])}}
                    value={value}
                    ref={ref}
                    isInvalid={!!errors.name}
                    type="text"
                    placeholder="Enter category name"
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Stack direction="horizontal" gap={3}>
              <Button variant="success" type="submit" disabled={isSubmitting}>
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
                Save
              </Button>

              <div className="vr" />

              <Button
                variant="outline-secondary"
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </Button>
            </Stack>
          </div>
        </Form>
      ) : (
        <div className="d-flex gap-3 gap-sm-0 justify-content-sm-between justify-content-center align-items-center flex-wrap flex-sm-nowrap">
          <p className="mb-0">{category.name}</p>

          <Stack direction="horizontal" gap={3}>
            <Button
              variant="outline-primary"
              onClick={() => navigate({
                pathname: '/profile/expenses',
                search: `?filter=${encodedCategory}`,
              })}
            >
              Show expenses
            </Button>
            <div className="vr" />
            <Button
              variant="outline-secondary"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </Button>
            <div className="vr" />
            <Button
              variant="outline-danger"
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          </Stack>
        </div>
      )}

      {!!editError && (<ErrorAlert message={editError} />)}

      <Modal show={confirmDelete} onHide={() => setConfirmDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>You want to delete a category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          All expenses in this category will be deleted as well. Do you want to delete this category?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleDelete(category.id)}>
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
            Delete
          </Button>
          <Button variant="outline-secondary" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
        </Modal.Footer>
        {!!deleteError && (<ErrorAlert message={deleteError} />)}
      </Modal>
    </Card>
  );
}

type Props = {
  categories: Category[];
}

const CategoriesList: React.FC<Props> = ({ categories }) => {
  return (
    <Stack gap={3}>
      {categories.map(category => (
        <CategoriesItem key={category.id} category={category} />
      ))}
    </Stack>
  )
}

export default CategoriesList
