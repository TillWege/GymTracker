import { Flex, Title } from "@mantine/core";
import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";

export function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <Flex w={"100%"} justify={"center"} align={"center"} gap={"xl"}>
      <Image
        src={"/logo-light.svg"}
        alt={"GT Logo in dark mode"}
        width={32}
        height={32}
      />
      <Title order={isMobile ? 3 : 1} ta={"center"}>
        Gym Tracker
      </Title>
    </Flex>
  );
}
