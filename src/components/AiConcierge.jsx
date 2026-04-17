import React, { useState, useRef, useEffect, useCallback } from 'react';
import geminiService from '../services/GeminiService';

/**
 * AiConcierge — Chat interface for the Google Gemini-powered stadium concierge.
 * Provides real-time crowd routing guidance using live telemetry data.
 * 
 * @security User inputs are sanitized via GeminiService.sanitizeInput().
 * @accessibility Chat history uses aria-live="polite" for screen readers.
 */
const AiConcierge = React.memo(({ stadiumState }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Welcome to Chepauk! 🏟️ I'm Lumina, your AI-powered digital concierge. Ask me about food queues, water stations, crowd levels, or anything else — I use live stadium telemetry to help you! Whistle Podu! 🦁💛" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    
    const userMsg = trimmed;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await geminiService.getConciergeResponse(userMsg, stadiumState);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      console.error('[AiConcierge] Error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, stadiumState]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <section className="chat-container glass-panel" aria-label="AI Concierge Chat" id="ai-concierge">
      <h2 className="glow-text">🤖 AI Concierge — Powered by Google Gemini</h2>
      <div 
        className="chat-history" 
        ref={historyRef}
        aria-live="polite"
        aria-relevant="additions"
        role="log"
        aria-label="Chat message history"
        tabIndex={0}
      >
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`chat-message ${msg.role}`}
            role={msg.role === 'ai' ? 'status' : 'none'}
            aria-label={msg.role === 'ai' ? 'Lumina says' : 'You said'}
          >
            <span className="chat-role-tag">{msg.role === 'ai' ? '🤖 Lumina' : '👤 You'}</span>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="chat-message ai typing-indicator" aria-label="Lumina is analyzing stadium telemetry" role="status">
            <span className="chat-role-tag">🤖 Lumina</span>
            <span className="typing-dots">
              Consulting live telemetry<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
            </span>
          </div>
        )}
      </div>
      <div className="chat-input-area" role="form" aria-label="Send a message to the concierge">
        <input 
          type="text" 
          className="chat-input" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about queues, food, water, merch, scores..."
          aria-label="Type your message to the AI concierge"
          maxLength={500}
          autoComplete="off"
          id="concierge-input"
        />
        <button 
          className="chat-button" 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          aria-label="Send message to Lumina"
          id="concierge-send-btn"
        >
          {isLoading ? '⏳' : '🚀'} Send
        </button>
      </div>
      <p className="chat-disclaimer" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', opacity: 0.6, marginTop: '6px', textAlign: 'center' }}>
        Powered by Google Gemini 2.0 Flash · Responses based on live stadium telemetry
      </p>
    </section>
  );
});

AiConcierge.displayName = 'AiConcierge';

export default AiConcierge;
