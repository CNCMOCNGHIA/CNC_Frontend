import { Layout as SiteLayout } from "@/components/layout";
import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Moc Nghia CNC",
  description: "B2B CNC furniture processing website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteLayout>{children}</SiteLayout>
        <Providers />
      </body>
    </html>
  );
}
