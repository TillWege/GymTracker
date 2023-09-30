import { CookieConsent } from "react-cookie-consent";
import Link from "next/link";
import { useRouter } from "next/router";

export function CookieBanner() {
  const router = useRouter();

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      cookieName="cookieBanner"
      onAccept={() => {
        router.reload();
      }}
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
      expires={150}
    >
      This website uses cookies to enable user Authentication.{" "}
      <Link href={"/cookies"}>Learn More</Link>
    </CookieConsent>
  );
}
