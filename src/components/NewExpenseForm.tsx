import React, { useState } from 'react'
import { Button, Col, Form, Offcanvas, Row, Spinner } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ExpensePostData } from '../api/services/expenseService';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext'
import { usePageError } from '../hooks/usePageError';
import { getErrorMessage } from '../utils/getErrorMessage';
import ErrorAlert from './ErrorAlert';

type NewExpenseSubmit = {
  title: string,
  spentAt: string,
  amount: string,
  note?: string,
  categorySelect?: string,
  categoryInput?: string,
  noCategory?: string,
}

type Props = {
  show: boolean;
  setShow: (open: boolean) => void;
};

const NewExpenseForm: React.FC<Props> = ({ show, setShow }) => {
  const { addExpense, categories, getAllCategories } = useExpense();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = usePageError('');

  const maxDate = new Date().toISOString().substring(0,10);

  const {
    handleSubmit,
    control,
    formState: {errors},
    setError,
    clearErrors,
    reset,
  } = useForm<NewExpenseSubmit>({ reValidateMode: "onSubmit" });

  const onAdd: SubmitHandler<NewExpenseSubmit> = async (data) => {
    setSubmitErr('');
    setIsSubmitting(true);

    if (!data.categorySelect && !data.categoryInput) {
      setError('noCategory', {
        type: 'custom',
        message: categories.length
          ? 'You must either choose category or add a new one'
          : 'You must enter category name',
      });

      setIsSubmitting(false);
      return;
    }

    const newExpense: ExpensePostData = {
      title: data.title,
      amount: Number(data.amount),
      spentAt: data.spentAt,
      category: data.categorySelect || data.categoryInput?.trim() as string,
    }

    data.note && (newExpense.note = data.note);

    try {
      await addExpense(newExpense);
      reset();
      setShow(false);
    } catch(error) {
      setSubmitErr(getErrorMessage(error));
    }

    setIsSubmitting(false);
  };

  return (
    <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement="end"
    >
      <Offcanvas.Header closeButton className="my-4">
        <Offcanvas.Title as={'h2'}>Add new expense</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Form onSubmit={handleSubmit(onAdd)}>
          <Form.Group controlId="title" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Controller control={control} name="title"
              defaultValue=""
              rules={{
              required: 'You need to enter a title',
              pattern: {
                value: /\S+/,
                message: 'You need to enter a valid title'
              }
              }}
              render={({ field: { onChange, value, ref } }) => (
                <Form.Control
                  onChange={(value) => {onChange(value); clearErrors(["title"])}}
                  value={value}
                  ref={ref}
                  isInvalid={!!errors.title}
                  type="text"
                  placeholder="Enter a title"
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="amount">
              <Form.Label>Amount</Form.Label>
                <Controller control={control} name="amount"
                  defaultValue=""
                  rules={{
                    required: 'You need to enter amount',
                    pattern: {
                      value: /^(?!0$)\d+$/,
                      message: 'Your amount cannot be zero'
                    }
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <Form.Control
                      onChange={(value) => {onChange(value); clearErrors(["amount"])}}
                      value={value}
                      ref={ref}
                      isInvalid={!!errors.amount}
                      type="number"
                      placeholder="Enter amount"
                      step={10}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} controlId="date">
              <Form.Label>Date</Form.Label>
                <Controller control={control} name="spentAt"
                  defaultValue=""
                  rules={{
                    required: 'You need to choose a date',
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <Form.Control
                      onChange={(value) => {onChange(value); clearErrors(["spentAt"])}}
                      value={value}
                      ref={ref}
                      isInvalid={!!errors.spentAt}
                      type="date"
                      max={maxDate}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.spentAt?.message}
                </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group controlId="note" className="mb-3">
            <Form.Label>Note</Form.Label>
            <Controller control={control} name="note"
              defaultValue=""
              rules={{
                pattern: {
                  value: /\S+/,
                  message: 'Your note cannot be empty'
                }
              }}
              render={({ field: { onChange, value, ref } }) => (
                <Form.Control
                  as="textarea"
                  rows={2}
                  onChange={(value) => {onChange(value); clearErrors(["note"])}}
                  value={value}
                  ref={ref}
                  isInvalid={!!errors.note}
                  type="text"
                  placeholder="Provide a description for the expense"
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.note?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="mb-5">
            <p className="mb-1">Category</p>
            {!!categories.length && (
              <Form.Group as={Col} controlId="categorySelect">
                <Form.Label visuallyHidden>Select category</Form.Label>
                <Controller control={control} name="categorySelect"
                  defaultValue=""
                  render={({ field: { onChange, value, ref } }) => (
                    <Form.Select
                      onChange={(value) => {onChange(value); clearErrors(["noCategory", "categorySelect"])}}
                      value={value}
                      ref={ref}
                      isInvalid={!!errors.categorySelect}
                      disabled={!categories.length}
                    >
                      <option>Choose category</option>
                      {categories.map(category => (
                        <option
                          key={category.id}
                          value={category.name}
                        >
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                />
              </Form.Group>
            )}

            <Form.Group as={Col} controlId="categoryInput">
              <Form.Label visuallyHidden>Add new category</Form.Label>
              <Controller control={control} name="categoryInput"
                defaultValue=""
                rules={{
                pattern: {
                  value: /\S+/,
                  message: 'You need to enter a valid category name'
                }
                }}
                render={({ field: { onChange, value, ref } }) => (
                  <Form.Control
                    onChange={(value) => {onChange(value); clearErrors(["noCategory", 'categoryInput'])}}
                    value={value}
                    ref={ref}
                    isInvalid={!!errors.categoryInput}
                    type="text"
                    placeholder={categories.length ? '...or add new' : 'Add new category'}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.categoryInput?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {errors.noCategory?.message && (
              <div className="invalid-feedback d-block">
                {errors.noCategory?.message}
              </div>
            )}
          </Row>

          <div className="d-flex gap-3 justify-content-end mb-3">
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
              onClick={() => setShow(false)}
            >
              Cancel
            </Button>
          </div>
        </Form>

        {!!submitErr && (<ErrorAlert message={submitErr} />)}
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default NewExpenseForm
