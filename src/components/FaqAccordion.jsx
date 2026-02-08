import React, { useState } from 'react';

const FaqAccordion = ({ faqs, title = "Câu hỏi thường gặp" }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-section bg-gray-50 py-12" style={{ backgroundColor: '#f8f9fa', padding: '60px 0' }}>
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="section-title text-2xl md:text-3xl font-bold text-center mb-12 text-[#D4AF37] uppercase" style={{ fontSize: '2.2em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '60px', textAlign: 'center' }}>
          {title}
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="faq-item bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300"
              style={{ 
                backgroundColor: '#fff', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease'
              }}
            >
              <button
                className={`faq-question w-full text-left p-6 flex justify-between items-center transition-colors duration-200 ${
                  openIndex === index ? 'bg-[#F9F5EB]' : 'hover:bg-gray-50'
                }`}
                style={{
                  padding: '1.5rem',
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: openIndex === index ? '#F9F5EB' : '#fff',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span 
                  className="text-lg font-semibold text-gray-800" 
                  style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}
                >
                  {faq.question}
                </span>
                <span 
                  className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                  style={{ 
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)', 
                    transition: 'transform 0.3s ease' 
                  }}
                >
                  <svg 
                    className="w-5 h-5 text-[#D4AF37]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </span>
              </button>
              
              <div
                id={`faq-answer-${index}`}
                className={`faq-answer transition-all duration-300 overflow-hidden ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                style={{
                  maxHeight: openIndex === index ? '500px' : '0',
                  opacity: openIndex === index ? '1' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease, opacity 0.3s ease'
                }}
              >
                <div 
                  className="faq-answer-content p-6 pt-0 border-t border-gray-100"
                  style={{ 
                    padding: '1.5rem', 
                    paddingTop: '0',
                    borderTop: '1px solid #f3f4f6'
                  }}
                >
                  <p 
                    className="text-gray-700 leading-relaxed" 
                    style={{ color: '#374151', lineHeight: '1.7' }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqAccordion;