import { fetchUser } from '../../bff/user';
import { fetchQuestion, fetchQuestions } from '../../bff/question';
import QuestionForm from '../../components/QuestionForm';

export default async function Page() {
  const user = await fetchUser();
  const question = await fetchQuestion();
  const questions = await fetchQuestions(5);

  return (
    <div>
      <h1>Result</h1>
      <div>
        <h2>user</h2>
        <pre>{user.id}</pre>
        <pre>{user.age}</pre>
        <pre>{user.name}</pre>
      </div>
      <div>
        <h2>Create Question</h2>
        <QuestionForm />
      </div>
      <div>
        <h2>Single Question</h2>
        <pre>{question.id}</pre>
        <pre>{question.author}</pre>
      </div>
      <div>
        <h2>Questions List</h2>
        {questions.map((q, index) => (
          <div key={q.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <h3>Question {index + 1}</h3>
            <pre>ID: {q.id}</pre>
            <pre>Title: {q.title}</pre>
            <pre>Author: {q.author}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
