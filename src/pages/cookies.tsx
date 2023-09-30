export default function Cookies() {
  return (
    <>
      <p>This websites uses the following cookies:</p>
      <ul>
        <li>
          <strong>cookieBanner</strong> - This cookie is used to remember if you
          have accepted the cookie banner.
        </li>
        <li>
          <strong>next-auth.csrf-token</strong> - This cookie is used to prevent
          cross site request forgery attacks. It is used to validate that the
          request comes from the website and not from a third party.
        </li>
        <li>
          <strong>next-auth.session-token</strong> - This cookie is used to
          remember your user login for future use.
        </li>

        <li>
          <strong>next-auth.csrf-token</strong> - This cookie is used to
          remember on which subpart ob the website you last logged in.
        </li>
      </ul>
    </>
  );
}
