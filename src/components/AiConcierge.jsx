import React, { useState, useRef, useEffect } from 'react';
import geminiService from '../services/GeminiService';

const AiConcierge = ({ stadiumState }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Welcome to Chepauk! I am Lumina, your digital concierge. How can I help you navigate the stadium today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await geminiService.getConciergeResponse(userMsg, stadiumState);
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-container glass-panel">
      <h2 className="glow-text">AI Concierge</h2>
      <div 
        className="chat-history" 
        ref={historyRef}
        aria-live="polite"
        role="log"
      >
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="chat-message ai typing-indicator" aria-label="Lumina is typing">
            Consulting telemetry...
          </div>
        )}
      </div>
      <div className="chat-input-area">
        <input 
          type="text" 
          className="chat-input" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about queues, food, or navigation..."
          aria-label="Ask the concierge"
        />
        <button 
          className="chat-button" 
          onClick={handleSend}
          disabled={isLoading}
          aria-label="Send message to concierge"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AiConcierge;
