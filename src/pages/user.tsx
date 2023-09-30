import { useRouter } from "next/router";
import { UserIndex } from "~/components/userPage/userIndex";
import { UserProfile } from "~/components/userPage/userProfile";

export default function User() {
  const router = useRouter();
  const id = router.query.id as string;

  if (!id) return <UserIndex />;

  return <UserProfile id={id} />;
}
