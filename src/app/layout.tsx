import "~/styles/globals.css";
import {
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Biblia",
  description: "Biblia para todos",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
