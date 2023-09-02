import { Box, Button } from "@mantine/core";

interface PageWithFabProps {
  children: React.ReactNode;
  onFabClick: () => void;
  fabText?: string;
}

export function PageWithFab({ children, onFabClick }: PageWithFabProps) {
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
        Add Exercise
      </Button>
      reee
      {children}
    </Box>
  );
}
