import React from 'react'
import { Form } from 'react-bootstrap';
import {  Control, Controller, FieldErrors, UseFormClearErrors } from 'react-hook-form';

type NewEmail = {
    newEmail: string;
}

type Props = {
    control: Control<any, any, any>,
    errors: FieldErrors<NewEmail>,
    clearErrors: UseFormClearErrors<NewEmail>,
}

const NewEmailInput: React.FC<Props> = ({ control, errors, clearErrors }) => {
  return (
    <>
      <Controller control={control} name="newEmail"
        defaultValue=""
        rules={{
          required: 'You need to enter a new email',
          pattern: {
            value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
            message: 'You need to enter a valid email'
          }
        }}
        render={({ field: { onChange, value, ref } }) => (
          <Form.Control
            onChange={(value) => {onChange(value); clearErrors(["newEmail"])}}
            value={value}
            ref={ref}
            isInvalid={!!errors.newEmail}
            type="email"
            placeholder="Enter new email"
            autoComplete="email"
          />
        )}
      />
      <Form.Control.Feedback type="invalid">
        {errors.newEmail?.message}
      </Form.Control.Feedback>
    </>
  )
}

export default NewEmailInput
