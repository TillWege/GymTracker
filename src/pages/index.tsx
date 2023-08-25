import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";
import { Box, Modal, Title } from "@mantine/core";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>GymTracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
        <Title order={1}>Gym Tracker</Title>
        <Title order={3}>By Tillwege</Title>
        {/*<div>
          <p>{hello.data ? hello.data.greeting : "Loading tRPC query..."}</p>
        </div>*/}
        <AuthShowcase></AuthShowcase>
      </Box>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div>
      <p>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
