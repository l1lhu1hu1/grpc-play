import { fetchUser } from '../../bff/user';
import { fetchQuestion } from '../../bff/question';

export default async function Page() {
  const user = await fetchUser();
  const question= await fetchQuestion();
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
        <h2>question</h2>
        <pre>{question.id}</pre>
        <pre>{question.author}</pre>
      </div>
    </div>
  );
}
