import React from 'react'
import { Form } from 'react-bootstrap';
import {  Control, Controller, FieldErrors, UseFormClearErrors } from 'react-hook-form';

type Password = {
    password: string;
}

type Props = {
    control: Control<any, any, any>,
    errors: FieldErrors<Password>,
    clearErrors: UseFormClearErrors<Password>,
}

export const PasswordInput: React.FC<Props> = ({ control, errors, clearErrors }) => {
  return (
    <>
        <Controller control={control} name="password"                                            
              defaultValue=""
              rules={{ 
                required: 'You need to enter a password', 
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
                  message: 'Your password must be at least 8 characters, contain lower case letters, upper case letters, numbers and special characters.'
                }
              }}                                                                         
              render={({ field: { onChange, value, ref } }) => (                             
                <Form.Control                                                                        
                  onChange={(value) => {onChange(value); clearErrors(["password"])}} 
                  value={value} 
                  ref={ref}                         
                  isInvalid={!!errors.password}  
                  type="password"                                                        
                  placeholder="Enter password" 
                  autoComplete="current-password"
                />                                                      
          )} 
        /> 
        <Form.Control.Feedback type="invalid">                                                     
          {errors.password?.message}                                                               
        </Form.Control.Feedback>
    </>
  )
}