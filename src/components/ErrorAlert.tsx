import React from 'react'
import { Alert } from 'react-bootstrap'

type Props = {
  message: string,
}

const ErrorAlert: React.FC<Props> = ({ message }) => {
  return (
    <Alert variant="danger" className="text-center">
      {message}
    </Alert>
  )
}

export default ErrorAlert
