'use client';

import { useState } from 'react';

export default function MessageForm() {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, author }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Message sent successfully!');
        setContent('');
      } else {
        setMessage(`Failed to send message: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="author" style={{ display: 'block', marginBottom: '5px' }}>
            Your Name:
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '5px' }}>
            Message:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            style={{ width: '100%', padding: '8px', resize: 'vertical' }}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: '10px',
            padding: '8px',
            backgroundColor: message.includes('Error') || message.includes('Failed') ? '#f8d7da' : '#d4edda',
            color: message.includes('Error') || message.includes('Failed') ? '#721c24' : '#155724',
            borderRadius: '4px',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
