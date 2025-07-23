import React, { useState, useEffect } from 'react';
import '../styles/ConfirmationMessage.css';

const ConfirmationMessage = () => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const handleConfirmation = (event) => {
      const { message } = event.detail;
      setMessage(message);
      setVisible(true);
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setVisible(false);
      }, 3000);
    };
    
    document.addEventListener('showConfirmation', handleConfirmation);
    return () => {
      document.removeEventListener('showConfirmation', handleConfirmation);
    };
  }, []);
  
  if (!visible) return null;
  
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
