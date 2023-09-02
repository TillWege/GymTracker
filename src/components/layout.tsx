import Head from "next/head";
import { Header } from "~/components/header";
import { ActionIcon, Box, Button, Tabs, Text, Title } from "@mantine/core";
import { IconLayoutNavbarExpand } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [expanded, { toggle }] = useDisclosure(!isMobile);
  const [selectedTab, setSelectedTab] = useState(
    router.pathname.split("/")[1] || "workout"
  );

  const getExpanded = () => {
    if (isMobile) return false;
    return expanded;
  };

  return (
    <>
      <Header />
      <Box
        sx={(theme) => ({
          backgroundColor: theme.colors.dark[8],
        })}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          height: "100vh",
          width: "100%",
        }}
      >
        <Tabs
          value={selectedTab}
          variant="outline"
          defaultValue="workout"
          maw={1200}
          w={"95%"}
          orientation={isMobile ? "horizontal" : "vertical"}
          onTabChange={(value) => {
            if (value == "collapse") {
              toggle();
            } else {
              void router.push(`/${value}`);
              setSelectedTab(value as string);
            }
          }}
        >
          {isMobile && (
            <Title order={4} align={"center"}>
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
            </Title>
          )}
          <Tabs.List mt={"md"}>
            <Tabs.Tab value="workout" w={isMobile ? "33%" : undefined}>
              <Text weight={700} size={"md"}>
                💪{getExpanded() ? " Workouts" : ""}
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="exercise" w={isMobile ? "34%" : undefined}>
              <Text weight={700} size={"md"}>
                🏋️{getExpanded() ? " Exercises" : ""}
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="user" w={isMobile ? "33%" : undefined}>
              <Text weight={700} size={"md"}>
                👤️{getExpanded() ? " User" : ""}
              </Text>
            </Tabs.Tab>
            {isMobile || (
              <Tabs.Tab value="collapse">
                <IconLayoutNavbarExpand
                  style={{ rotate: expanded ? "90deg" : "270deg" }}
                />
              </Tabs.Tab>
            )}
          </Tabs.List>

          {children}
        </Tabs>
      </Box>
    </>
  );
}
