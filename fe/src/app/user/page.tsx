import { fetchUser } from '../../bff/user';
import { fetchQuestion } from '../../bff/question';

export default async function Page() {
  const user = await fetchUser();
  const question= await fetchQuestion();
  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(question, null, 2)}</pre>
    </div>
  );
}
