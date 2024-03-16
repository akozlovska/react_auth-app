import React, { useState } from 'react'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ExpensePatchData } from '../api/services/expenseService';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext'
import { usePageError } from '../hooks/usePageError';
import { Expense } from '../types/Expense';
import { getErrorMessage } from '../utils/getErrorMessage';
import ErrorAlert from './ErrorAlert';

type ChangeExpenseSubmit = {
  title: string,
  spentAt: string,
  amount: string,
  note?: string,
  categorySelect?: string,
  categoryInput?: string,
  noCategory?: string,
}

type Props = {
  defaultExpense: Expense;
  setShow: (shoe: boolean) => void;
};

const ExpenseEditForm: React.FC<Props> = ({ defaultExpense, setShow }) => {
  const { changeExpense, categories, getAllCategories } = useExpense();
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
  } = useForm<ChangeExpenseSubmit>({ reValidateMode: "onSubmit" });

  const onChange: SubmitHandler<ChangeExpenseSubmit> = async (data) => {
    setSubmitErr('');
    setIsSubmitting(true);

    if (!data.categorySelect && !data.categoryInput) {
      setError('noCategory', {
        type: 'custom',
        message: 'You must either choose category or add a new one',
      });

      setIsSubmitting(false);
      return;
    }

    const fieldsToUpdate: ExpensePatchData = {};
    data.title !== defaultExpense.title && (fieldsToUpdate.title = data.title);
    Number(data.amount) !== defaultExpense.amount && (fieldsToUpdate.amount = Number(data.amount));
    data.spentAt !== defaultExpense.spentAt && (fieldsToUpdate.spentAt = data.spentAt);
    data.note !== defaultExpense.note && (fieldsToUpdate.note = data.note);

    const dataCategory = data.categoryInput?.trim() || data.categorySelect;
    dataCategory !== defaultExpense.category && (fieldsToUpdate.category = dataCategory);

    try {
      await changeExpense(defaultExpense.id, fieldsToUpdate);
      reset();
      setShow(false);
    } catch(error) {
      setSubmitErr(getErrorMessage(error));
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onChange)}>
        <Form.Group controlId="title" className="mb-3">
          <Form.Label className="fw-medium">Title</Form.Label>
          <Controller control={control} name="title"
            defaultValue={defaultExpense.title}
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
            <Form.Label className="fw-medium">Amount</Form.Label>
              <Controller control={control} name="amount"
                defaultValue={defaultExpense.amount.toString()}
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
            <Form.Label className="fw-medium">Date</Form.Label>
              <Controller control={control} name="spentAt"
                defaultValue={new Date(defaultExpense.spentAt).toISOString().substring(0,10)}
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
          <Form.Label className="fw-medium">Note</Form.Label>
          <Controller control={control} name="note"
            defaultValue={defaultExpense.note ? defaultExpense.note : ''}
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

        <Row className="mb-3">
          <p className="mb-1 fw-medium">Category</p>
          <Form.Group as={Col} controlId="categorySelect">
            <Form.Label visuallyHidden>Category</Form.Label>
            <Controller control={control} name="categorySelect"
              defaultValue={defaultExpense.category}
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
                  placeholder="...or add new category"
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

        <div className="d-flex gap-3 justify-content-end align-items-center">
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
            onClick={() => setShow(false)}
          >
            Cancel
          </Button>
        </div>
      </Form>

      {!!submitErr && (<ErrorAlert message={submitErr} />)}
    </>
  )
}

export default ExpenseEditForm
