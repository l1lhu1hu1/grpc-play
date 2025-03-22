import { fetchUser } from '../../bff/user';

export default async function Page() {
  const user = await fetchUser();
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
