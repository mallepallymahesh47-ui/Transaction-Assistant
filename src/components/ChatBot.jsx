import { useEffect, useRef, useState } from 'react';

const CHAT_API_URL = import.meta.env.VITE_PAYBOT_API_URL || 'http://localhost:8000';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! Ask me about your transactions, e.g., "recent failed payments".' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiHealthy, setApiHealthy] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    fetch(`${CHAT_API_URL}/`)
      .then((res) => {
        if (!res.ok) throw new Error(`Health endpoint returned ${res.status}`);
        setApiHealthy(true);
      })
      .catch(() => setApiHealthy(false));
  }, []);

  const sendMessage = async (event) => {
    event?.preventDefault();
    const query = input.trim();
    if (!query) return;

    setMessages((prev) => [...prev, { from: 'user', text: query }]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${CHAT_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`API response ${res.status}`);
      }

      const data = await res.json();
      if (data.status !== 'success') {
        throw new Error(data.message || 'Unknown error');
      }

      setMessages((prev) => [...prev, { from: 'bot', text: data.answer || 'No answer available.' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: 'bot', text: `Sorry, I could not answer (\n${err.message}).` }]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open chat"
      >
        {isOpen ? '×' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">PayBot Assistant</div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={`${msg.from}-${idx}`} className={`chatbot-message ${msg.from}`}>
                <span>{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {!apiHealthy && (
            <div className="chatbot-error" style={{ margin: '0 10px' }}>
              PayBot backend is unreachable. Please confirm backend is running at {CHAT_API_URL} and CORS is enabled.
            </div>
          )}

          <form className="chatbot-input-area" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a transaction detail..."
              disabled={loading || !apiHealthy}
              aria-label="Chat input"
            />
            <button type="submit" disabled={loading || !apiHealthy}>
              {loading ? 'Waiting...' : 'Send'}
            </button>
          </form>
          {error && <p className="chatbot-error">{error}</p>}
        </div>
      )}
    </div>
  );
}
