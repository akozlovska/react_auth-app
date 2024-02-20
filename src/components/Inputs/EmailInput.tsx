import React from 'react'
import { Form } from 'react-bootstrap';
import {  Control, Controller, FieldErrors, UseFormClearErrors } from 'react-hook-form';

type Email = {
    email: string;
}

type Props = {
    control: Control<any, any, any>,
    errors: FieldErrors<Email>,
    clearErrors: UseFormClearErrors<Email>,
}

const EmailInput: React.FC<Props> = ({ control, errors, clearErrors }) => {
  return (
    <>
        <Controller control={control} name="email"                                            
            defaultValue=""
            rules={{ 
              required: 'You need to enter an email', 
              pattern: {
                value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
                message: 'You need to enter a valid email'
              }
            }}                                                                        
            render={({ field: { onChange, value, ref } }) => (                             
              <Form.Control 
                onChange={(value) => {onChange(value); clearErrors(["email"])}} 
                value={value} 
                ref={ref}                            
                isInvalid={!!errors.email}
                type="email"                                                          
                placeholder="Enter email"
                autoComplete="email" 
              />
            )} 
        /> 
        <Form.Control.Feedback type="invalid">                                                     
            {errors.email?.message}                                                                  
        </Form.Control.Feedback>
    </>
  )
}

export default EmailInput