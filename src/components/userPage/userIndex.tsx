import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function UserIndex() {
  const user = useSession();
  const router = useRouter();

  if (typeof window !== "undefined") {
    if (!user?.data?.user) {
      void router.push("/home");
    } else {
      void router.push({
        pathname: "/user/",
        query: { id: user.data.user.id },
      });
    }
  }

  return <></>;
}
