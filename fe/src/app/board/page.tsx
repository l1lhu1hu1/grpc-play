'use client';

import { useState, useEffect, useRef } from 'react';
import MessageForm from '../../components/MessageForm';

interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cancelStreamRef = useRef<(() => void) | null>(null);

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  useEffect(() => {
    setLoading(true);

    try {
      const eventSource = new EventSource('/api/board/stream?limit=100');

      eventSource.onmessage = (event) => {
        console.log('1111111111111111111')
        try {
          const message = JSON.parse(event.data);

          if (message.error) {
            setError(`Server error: ${message.error}`);
            setLoading(false);
            return;
          }

          setMessages(prevMessages => {
            if (!prevMessages.some(m => m.id === message.id)) {
              return [...prevMessages, message];
            }
            return prevMessages;
          });

          setLoading(false);
        } catch (err) {
          console.error('Error parsing message:', err, event.data);
        }
      };

      eventSource.onopen = () => {
        console.log('###################')
        console.log('SSE connection opened');
      };

      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        setError('Error connecting to message stream. Please refresh the page.');
        setLoading(false);
        eventSource.close();
      };

      cancelStreamRef.current = () => {
        eventSource.close();
      };
    } catch (err) {
      console.error('Error setting up message stream:', err);
      setError('Error connecting to message board. Please try again later.');
      setLoading(false);
    }

    return () => {
      if (cancelStreamRef.current) {
        cancelStreamRef.current();
      }
    };
  }, []);

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Message Board</h1>

      <div style={{ marginBottom: '40px' }}>
        <h2>Post a Message</h2>
        <MessageForm />
      </div>

      <div>
        <h2>Messages</h2>
        {loading && messages.length === 0 ? (
          <p>Loading messages...</p>
        ) : error ? (
          <div style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        ) : messages.length === 0 ? (
          <p>No messages yet. Be the first to post!</p>
        ) : (
          <div>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '20px',
                  padding: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                  {msg.author}
                </div>
                <div style={{ marginBottom: '8px', whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  {formatTimestamp(msg.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
