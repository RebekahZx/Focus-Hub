import { Atkinson_Hyperlegible, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Providers } from "./Provider";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "700", "800"] });
const body = Atkinson_Hyperlegible({ subsets: ["latin"], variable: "--font-body", weight: ["400", "700"] });

export const metadata = {
  title: { default: "Focus Hub: study sessions on a shared timer", template: "%s | Focus Hub" },
  description: "Plan a study session, share the link, and work through the same focus and break rounds together.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
