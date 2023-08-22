import React, { useState } from 'react';
import './App.css';

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const toggleOpen = () => {
    setIsSpinning(true);
    setIsOpen(!isOpen);
    setTimeout(() => {
      setIsSpinning(false);
    }, 300);
  };

  return (
    <div className="FAQ">
      <div className={`faq-item ${isOpen ? 'open' : ''}`}>
        <div className="faq-question" onClick={toggleOpen}>
          <h3>{question}</h3>
          <span className={`faq-icon ${isOpen ? 'rotate-right' : 'rotate-left'} ${isSpinning ? 'spin' : ''}`}>&times;</span>
        </div>
        {isOpen && <div className="faq-answer">{answer}</div>}
      </div>
    </div>
  );
};

export default FAQ;
