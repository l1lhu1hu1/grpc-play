'use client';

import { useState } from 'react';

export default function QuestionForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Question created successfully!');
        setTitle('');
        setAuthor('');
        window.location.reload();
      } else {
        setMessage(`Failed to create question: ${data.error || 'Unknown error'}`);
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
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="author" style={{ display: 'block', marginBottom: '5px' }}>
            Author:
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
          {isSubmitting ? 'Creating...' : 'Create Question'}
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
