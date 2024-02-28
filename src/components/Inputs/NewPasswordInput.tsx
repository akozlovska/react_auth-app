import React from 'react'
import { Form } from 'react-bootstrap';
import {  Control, Controller, FieldErrors, UseFormClearErrors } from 'react-hook-form';

type NewPassword = {
  newPassword: string;
}

type Props = {
  control: Control<any, any, any>,
  errors: FieldErrors<NewPassword>,
  clearErrors: UseFormClearErrors<NewPassword>,
}

export const NewPasswordInput: React.FC<Props> = ({ control, errors, clearErrors }) => {
  return (
    <>
      <Controller control={control} name="newPassword"
        defaultValue=""
        rules={{
          required: 'You need to enter a new password',
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
            message: 'Your password must be at least 8 characters, contain lower case letters, upper case letters, numbers and special characters.'
          }
        }}
        render={({ field: { onChange, value, ref } }) => (
          <Form.Control
            onChange={(value) => {onChange(value); clearErrors(["newPassword"])}}
            value={value}
            ref={ref}
            isInvalid={!!errors.newPassword}
            type="password"
            placeholder="Enter new password"
            autoComplete="current-password"
          />
        )}
      />
      <Form.Control.Feedback type="invalid">
        {errors.newPassword?.message}
      </Form.Control.Feedback>
    </>
  )
}
