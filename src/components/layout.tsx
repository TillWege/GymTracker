import { Header } from "~/components/header";
import {
  Box,
  Flex,
  Footer,
  ScrollArea,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBarbell,
  IconBuildingEstate,
  IconLayoutNavbarExpand,
  IconLogin,
  IconLogout,
  IconUser,
  IconWeight,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [expanded, { toggle }] = useDisclosure(!isMobile);
  const [selectedTab, setSelectedTab] = useState(
    router.pathname.split("/")[1] || "session"
  );
  const sessionData = useSession();

  const getExpanded = () => {
    if (isMobile) return false;
    return expanded;
  };

  const data = [
    {
      icon: <IconBuildingEstate />,
      iconColor: "yellow",
      value: "session",
    },
    {
      icon: <IconWeight />,
      iconColor: "indigo",
      value: "workout",
    },
    {
      icon: <IconBarbell />,
      iconColor: "green",
      value: "exercise",
    },
    {
      icon: <IconUser />,
      iconColor: "red",
      value: "user",
    },
    {
      icon: sessionData.data?.user ? <IconLogout /> : <IconLogin />,
      iconColor: "blue",
      value: sessionData.data?.user ? "logout" : "login",
      onClick: () => {
        if (sessionData.data?.user) {
          void signOut();
        } else {
          void signIn();
        }
      },
    },
  ];

  if (!isMobile) {
    data.push({
      icon: (
        <IconLayoutNavbarExpand
          style={{ rotate: expanded ? "90deg" : "270deg" }}
        />
      ),
      iconColor: "gray",
      value: "collapse",
      onClick: toggle,
    });
  }

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colors.dark[8],
      })}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Header />
      <Tabs
        value={selectedTab}
        variant="outline"
        defaultValue="session"
        maw={800}
        w={"95%"}
        style={
          isMobile
            ? {
                display: "flex",
                flexDirection: "column",
                flex: "auto",
              }
            : {
                flex: "auto",
              }
        }
        sx={(theme) => ({
          borderRight: isMobile ? "" : `1px solid ${theme.colors.dark[4]}`,
        })}
        orientation={isMobile ? "horizontal" : "vertical"}
        onTabChange={(value) => {
          if (value == "collapse" || value == "login" || value == "logout") {
            return;
          }
          void router.push(`/${value}`);
          setSelectedTab(value as string);
        }}
      >
        {isMobile && (
          <Title order={4} align={"center"}>
            {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
          </Title>
        )}

        <Tabs.List mt={"md"}>
          {data.map((tab) => (
            <Tab
              key={tab.value}
              isMobile={isMobile}
              expanded={getExpanded()}
              totalCount={data.length}
              onClick={tab.onClick}
              {...tab}
            />
          ))}
        </Tabs.List>
        <ScrollArea
          ml={isMobile ? undefined : "1rem"}
          pr={isMobile ? undefined : "1rem"}
          h={isMobile ? "85vh" : "94vh"}
          w={"100%"}
        >
          {children}
        </ScrollArea>
      </Tabs>

      <Bottom
        clearFunc={() => {
          setSelectedTab("");
        }}
      />
    </Box>
  );
}

interface TabProps {
  value: string;
  icon: React.ReactNode;
  iconColor: string;
  isMobile: boolean;
  expanded: boolean;
  totalCount: number;
  onClick?: () => void;
}

export function Tab({
  value,
  icon,
  iconColor,
  isMobile,
  expanded,
  totalCount,
  onClick,
}: TabProps) {
  const title = value.charAt(0).toUpperCase() + value.slice(1);
  return (
    <Tabs.Tab
      value={value}
      w={isMobile ? (100 / totalCount).toString() + "%" : undefined}
      onClick={onClick}
    >
      <Flex direction={"row"} gap={"md"}>
        <ThemeIcon title={title} color={iconColor}>
          {icon}
        </ThemeIcon>
        {expanded && (
          <Text weight={700} size={"md"}>
            {title}
          </Text>
        )}
      </Flex>
    </Tabs.Tab>
  );
}

interface BottomProps {
  clearFunc: () => void;
}

export function Bottom({ clearFunc }: BottomProps) {
  const path = useRouter().pathname.split("/")[1];
  return (
    <Footer
      height={30}
      w={"100%"}
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "50px",
      }}
    >
      <Link href={"/about"} style={{ color: "inherit" }} onClick={clearFunc}>
        <Text align={"center"} weight={path == "about" ? 700 : undefined}>
          About
        </Text>
      </Link>
      <Text align={"center"}>By @Tillwege</Text>
      <Link href={"/privacy"} style={{ color: "inherit" }} onClick={clearFunc}>
        <Text align={"center"} weight={path == "privacy" ? 700 : undefined}>
          Privacy
        </Text>
      </Link>
    </Footer>
  );
}
