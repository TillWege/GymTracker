import { Header } from "~/components/header";
import { Box, Flex, ScrollArea, Tabs, Text, ThemeIcon } from "@mantine/core";
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
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { UseIsMobile } from "~/common/hooks";
import { CookieBanner } from "~/components/cookie";
import { getCookieConsentValue } from "react-cookie-consent";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const isMobile = UseIsMobile();
  const [expanded, { toggle }] = useDisclosure(!isMobile);
  const [selectedTab, setSelectedTab] = useState(
    router.pathname.split("/")[1] || "session"
  );
  const sessionData = useSession();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getExpanded = () => {
    if (isMobile) return false;
    return expanded;
  };

  const data: {
    icon: React.ReactNode;
    iconColor: string;
    value: string;
    onClick?: () => void;
  }[] = [
    {
      icon: <IconBuildingEstate />,
      iconColor: "yellow",
      value: "home",
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
  ];

  if (sessionData.data?.user) {
    data.push({
      icon: <IconUser />,
      iconColor: "red",
      value: "user",
    });
  }

  if (isClient && getCookieConsentValue("cookieBanner") == "true") {
    data.push({
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
    });
  }

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
      style={(theme) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: theme.colors.dark[8],
      })}
    >
      <CookieBanner />
      <Header />
      <Tabs
        value={selectedTab}
        variant="outline"
        defaultValue="home"
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
                borderRight: "1px solid var(--mantine-color-dark-4)",
              }
        }
        orientation={isMobile ? "horizontal" : "vertical"}
        onChange={(value) => {
          if (value == "collapse" || value == "login" || value == "logout") {
            return;
          }
          void router.push(`/${value}`);
          setSelectedTab(value as string);
        }}
      >
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
          <Text fw={700} size={"md"}>
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
  const isMobile = UseIsMobile();

  return (
    <Box
      h={30}
      w={"100%"}
      style={{
        display: "flex",
        justifyContent: "center",
        gap: isMobile ? "10px" : "50px",
      }}
    >
      <Link
        href={"https://github.com/TillWege/gymtracker"}
        style={{ color: "inherit" }}
        onClick={clearFunc}
      >
        <Text
          style={{
            textAlign: "center",
          }}
          fw={path == "code" ? 700 : undefined}
        >
          Code
        </Text>
      </Link>

      <Link href={"/about"} style={{ color: "inherit" }} onClick={clearFunc}>
        <Text
          style={{ textAlign: "center" }}
          fw={path == "about" ? 700 : undefined}
        >
          About
        </Text>
      </Link>
      <Text style={{ textAlign: "center" }}>By @Tillwege</Text>
      <Link href={"/privacy"} style={{ color: "inherit" }} onClick={clearFunc}>
        <Text
          style={{
            textAlign: "center",
          }}
          fw={path == "privacy" ? 700 : undefined}
        >
          Privacy
        </Text>
      </Link>
      <Link href={"/cookies"} style={{ color: "inherit" }} onClick={clearFunc}>
        <Text
          style={{
            textAlign: "center",
          }}
          fw={path == "cookies" ? 700 : undefined}
        >
          Cookies
        </Text>
      </Link>
    </Box>
  );
}
