import Document, { Head, Html, Main, NextScript } from "next/document";
import { ColorSchemeScript } from "@mantine/core";

// eslint-disable-next-line @typescript-eslint/naming-convention
export default class _Document extends Document {
  render() {
    return (
      <Html>
        <Head />
        <ColorSchemeScript defaultColorScheme="auto" />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
