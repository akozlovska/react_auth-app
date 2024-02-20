import React from 'react'
import { Alert } from 'react-bootstrap'

const NotFoundPage = () => {
  return (
    <Alert variant="danger" className="text-center">
      <Alert.Heading>Page not found</Alert.Heading>
    </Alert>
  )
}

export default NotFoundPage