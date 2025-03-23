'use client';

import { useState, useEffect } from 'react';
import QuestionForm from '../../components/QuestionForm';

interface Question {
  id: string;
  title: string;
  author: string;
}

export default function Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        const response = await fetch('/api/questions/list');
        const data = await response.json();

        if (data.success) {
          setQuestions(data.questions);
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch questions');
        }
      } catch (err) {
        setError('Error fetching questions. Please try again later.');
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Questions</h1>

      <div style={{ marginBottom: '40px' }}>
        <h2>Create New Question</h2>
        <QuestionForm />
      </div>

      <div>
        <h2>Questions List</h2>
        {loading ? (
          <p>Loading questions...</p>
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
        ) : questions.length === 0 ? (
          <p>No questions found.</p>
        ) : (
          <div>
            {questions.map((q, index) => (
              <div
                key={q.id}
                style={{
                  marginBottom: '20px',
                  padding: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <h3>Question {index + 1}</h3>
                <p><strong>ID:</strong> {q.id}</p>
                <p><strong>Title:</strong> {q.title}</p>
                <p><strong>Author:</strong> {q.author}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
