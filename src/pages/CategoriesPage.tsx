import React, { useState } from 'react'
import { Button, Card, Form, Spinner, Stack } from 'react-bootstrap'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import CategoriesList from '../components/CategoriesList';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext'
import { usePageError } from '../hooks/usePageError';
import { getErrorMessage } from '../utils/getErrorMessage';

const CategoriesPage = () => {
  const { categories, addCategory } = useExpense();
  const { user } = useAuth()!;

  const [isAdd, setIsAdd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = usePageError('');

  const {
    handleSubmit,
    control,
    formState: {errors},
    clearErrors,
    reset,
  } = useForm<{ name: string }>({ reValidateMode: "onSubmit" });

  const handleAdd:SubmitHandler<{ name: string }> = async({ name }) => {
    setError('');
    setIsSubmitting(true);

    try {
      await addCategory(user!.id, name.trim());
      setIsAdd(false);
      reset();
    } catch (error) {
      setError(getErrorMessage(error));
    }

    setIsSubmitting(false);
  }

  return (
    <div>
      <div className="d-flex gap-5 align-items-center mb-3">
        <h2 className="">Categories</h2>

        <Button
          variant="success"
          onClick={() => setIsAdd(true)}
        >
          + Add new
        </Button>
      </div>

      {isAdd && (
        <Card body className="mb-3">
          <Form onSubmit={handleSubmit(handleAdd)}>
            <div className="d-flex justify-content-between">
              <Form.Group controlId="category">
                <Form.Label visuallyHidden>Change category</Form.Label>
                <Controller control={control} name="name"
                  defaultValue=""
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
                  Add
                </Button>

                <div className="vr" />

                <Button
                  variant="outline-secondary"
                  onClick={() => setIsAdd(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </div>
          </Form>
          {!!error && (<ErrorAlert message={error} />)}
        </Card>
      )}

      <div>
        {categories.length ? (
          <CategoriesList categories={categories} />
        ) : (
          <h3 className="text-center">No categories yet</h3>
        )}

      </div>
    </div>
  )
}

export default CategoriesPage
