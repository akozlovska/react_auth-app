import React from 'react'
import { Form } from 'react-bootstrap';
import {  Control, Controller, FieldErrors, UseFormClearErrors } from 'react-hook-form';

type Username = {
  username: string;
}

type Props = {
  current?: string,
  control: Control<any, any, any>,
  errors: FieldErrors<Username>,
  clearErrors: UseFormClearErrors<Username>,
}

const UsernameInput: React.FC<Props> = ({ current = '', control, errors, clearErrors }) => {
  return (
    <>
      <Controller control={control} name="username"
        defaultValue={current}
        rules={{
          required: 'You need to enter a username',
          pattern: {
            value: /^[a-zA-Z0-9_]{6,12}$/,
            message: 'Your username must be at least 6 characters and contain only letters, numbers and underscore',
          }
        }}
        render={({ field: { onChange, value, ref } }) => (
          <Form.Control
            onChange={(value) => {onChange(value); clearErrors(["username"])}}
            value={value}
            ref={ref}
            isInvalid={!!errors.username}
            type="text"
            placeholder="Enter username"
            autoComplete="username"
          />
        )}
      />
      <Form.Control.Feedback type="invalid">
        {errors.username?.message}
      </Form.Control.Feedback>
    </>
  )
}

export default UsernameInput
