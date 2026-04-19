import { Layout as SiteLayout } from "@/components/layout";
import { Montserrat } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Moc Nghia CNC",
  description: "B2B CNC furniture processing website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${montserrat.variable}`}>
      <body className="font-body">
        <SiteLayout>{children}</SiteLayout>
        <Providers />
      </body>
    </html>
  );
}
