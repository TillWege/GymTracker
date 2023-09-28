import { useMediaQuery } from "@mantine/hooks";

export function useIsMobile() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return isMobile ?? false;
}
