import { useMediaQuery } from "@mantine/hooks";

export function UseIsMobile() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return isMobile ?? false;
}
