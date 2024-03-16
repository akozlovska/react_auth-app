import React from 'react'
import { Alert } from 'react-bootstrap'

const NotFoundPage = () => {
  return (
    <Alert variant="danger" className="text-center d-grid gap-2 col-lg-6 col-10 m-auto">
      <Alert.Heading>Page not found</Alert.Heading>
    </Alert>
  )
}

export default NotFoundPage
