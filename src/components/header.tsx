import { Button, Flex, Title } from "@mantine/core";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useMediaQuery } from "@mantine/hooks";

export function Header() {
  const sessionData = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <Flex w={"100%"} justify={"center"} align={"center"} gap={"xl"}>
      <Image
        src={"/logo-light.svg"}
        alt={"GT Logo in dark mode"}
        width={32}
        height={32}
      />
      <div>
        <Title order={isMobile ? 3 : 1} align={"center"}>
          Gym Tracker
        </Title>
        {isMobile || (
          <Title order={isMobile ? 4 : 3} align={"center"}>
            By @Tillwege
          </Title>
        )}
      </div>

      <Button
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </Flex>
  );
}
