import React from 'react'

interface ErrorsProps {
  message?: string
}

const Errors: React.FC<ErrorsProps> = ({ message }) => {
  if (!message) return null
  return (
    <p className="mdc-alert text-red-600 text-sm mb-1 border border-red-200 bg-red-50">{message}</p>
  )
}

export default Errors
