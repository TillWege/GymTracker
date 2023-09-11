import { Box, Button } from "@mantine/core";
import { useSession } from "next-auth/react";

interface PageWithFabProps {
  children: React.ReactNode;
  onFabClick: () => void;
  fabLabel: string;
}

export function PageWithFab({
  children,
  onFabClick,
  fabLabel,
}: PageWithFabProps) {
  const { data } = useSession();

  return (
    <Box w={"100%"} h={"100%"} pt={"1rem"}>
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
