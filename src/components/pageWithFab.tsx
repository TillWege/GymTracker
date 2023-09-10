import { Box, Button } from "@mantine/core";

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
  return (
    <Box w={"100%"} h={"100%"}>
      <Button
        onClick={onFabClick}
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
        }}
      >
        {fabLabel}
      </Button>
      {children}
    </Box>
  );
}
