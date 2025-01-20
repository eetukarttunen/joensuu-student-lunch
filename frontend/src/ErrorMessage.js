import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message }) => {
  return message ? (
    <div className="error-message">
      <p>{message}</p>
    </div>
  ) : null;
};

export default ErrorMessage;
