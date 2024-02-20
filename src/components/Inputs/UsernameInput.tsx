import React from 'react'
import { Form } from 'react-bootstrap';
import {  Control, Controller, FieldErrors, UseFormClearErrors } from 'react-hook-form';

type Username = {
    username: string;
}

type Props = {
    control: Control<any, any, any>,
    errors: FieldErrors<Username>,
    clearErrors: UseFormClearErrors<Username>,
}

const UsernameInput: React.FC<Props> = ({ control, errors, clearErrors }) => {
  return (
    <>
        <Controller control={control} name="username"                                            
            defaultValue=""
            rules={{ 
              required: 'You need to enter a username', 
              pattern: {
                value: /^.{8,}$/,
                message: 'Your username must be at least 8 characters'
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