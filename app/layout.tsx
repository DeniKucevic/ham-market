import { SecretNeonMode } from "@/components/konami-code";
import { NewYearCelebration } from "@/components/new-year-celebration";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
        <SecretNeonMode />
        <NewYearCelebration />
      </body>
    </html>
  );
}
