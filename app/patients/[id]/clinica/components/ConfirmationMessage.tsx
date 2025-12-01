'use client';

import React, { useState, useEffect } from 'react';
import './styles/ConfirmationMessage.css';

const ConfirmationMessage: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleShowConfirmation = (event: any) => {
      const { message } = event.detail;
      setMessage(message);
      setIsVisible(true);
      
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    document.addEventListener('showConfirmation', handleShowConfirmation);
    
    return () => {
      document.removeEventListener('showConfirmation', handleShowConfirmation);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="confirmation-message">
      <div className="confirmation-content">
        <span className="confirmation-icon">✓</span>
        <span className="confirmation-text">{message}</span>
      </div>
    </div>
  );
};

export default ConfirmationMessage;