import React from 'react';

export const WhatsAppFloat: React.FC = () => {
  return (
    <a
      href="https://wa.me/9779843959317"
      className="whatsapp-float group"
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with FindMyHostel on WhatsApp"
      aria-label="WhatsApp Support"
    >
      <i className="fab fa-whatsapp"></i>
      <span className="sr-only">Chat with us on WhatsApp</span>
    </a>
  );
};
