import { Loader } from "@mantine/core";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  if (typeof window !== "undefined") {
    void router.push("/workout");
  }

  return <Loader />;
}
