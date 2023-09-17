import { Box, Button, Divider, Group, Text } from "@mantine/core";
import { useSession } from "next-auth/react";

interface PageWithFabProps {
  children: React.ReactNode;
  onFabClick: () => void;
  fabLabel: string;
  pageTitle: string;
  titleChildren?: React.ReactNode;
}

export function PageWithFab({
  children,
  onFabClick,
  fabLabel,
  pageTitle,
  titleChildren,
}: PageWithFabProps) {
  const { data } = useSession();

  return (
    <Box w={"100%"} h={"100%"} pt={"1rem"}>
      <Group position={"apart"} align={"center"} mih={"2.5rem"}>
        <Text>{pageTitle}:</Text>
        {titleChildren}
      </Group>

      <Divider mt={"md"} mb={"md"} />

      {data?.user && (
        <Button
          onClick={onFabClick}
          style={{
            zIndex: 2,
            position: "absolute",
            bottom: "2rem",
            right: "2rem",
          }}
        >
          {fabLabel}
        </Button>
      )}
      {children}
    </Box>
  );
}
