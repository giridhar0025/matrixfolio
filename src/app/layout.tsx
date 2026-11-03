import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Pulichara Giridhar — Full-Stack Engineer / Simulation",
  description:
    "Full-stack engineer building production systems across web, mobile, and API — plus the agent harnesses that make AI-generated code shippable.",
  applicationName: "matrixfolio",
  authors: [{ name: "Pulichara Giridhar", url: "https://github.com/giridhar0025" }],
  creator: "Pulichara Giridhar",
  keywords: [
    "Pulichara Giridhar",
    "full-stack engineer",
    "React engineer",
    "TypeScript",
    "FastAPI",
    "AI-assisted development",
    "MCP",
    "agent harness",
    "creative developer",
  ],
  openGraph: {
    title: "Pulichara Giridhar — Full-Stack Engineer / Simulation",
    description:
      "A simulation you can inspect. Production systems, interface craft, and AI-native delivery.",
    type: "website",
    locale: "en_IN",
    siteName: "Pulichara Giridhar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulichara Giridhar — Full-Stack Engineer / Simulation",
    description:
      "Production systems, interface craft, and AI-native delivery. Enter the simulation.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#020604",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`
            .boot-overlay { display: none !important; }
            [data-reveal],
            .hero-kicker,
            .hero-name-line,
            .hero-role,
            .hero-bottom,
            .capability-panel {
              opacity: 1 !important;
              transform: none !important;
              visibility: visible !important;
            }
            .construct {
              height: auto !important;
            }
            .construct-sticky {
              position: relative !important;
              height: auto !important;
              min-height: 0 !important;
              overflow: visible !important;
            }
            .construct-panels {
              height: auto !important;
            }
            .construct-panel {
              position: relative !important;
              opacity: 1 !important;
              transform: none !important;
              filter: none !important;
              pointer-events: auto !important;
            }
            .section-rail {
              display: none !important;
            }
            .work-section {
              height: auto !important;
              overflow: visible !important;
            }
            .work-sticky {
              position: relative !important;
              height: auto !important;
              min-height: 0 !important;
              overflow: visible !important;
              padding-block: calc(var(--header-h) + 2rem) 2rem !important;
            }
            .work-viewport {
              display: block !important;
              overflow: visible !important;
              margin-top: 1.5rem;
            }
            .work-track {
              flex-direction: column !important;
              width: auto !important;
              transform: none !important;
            }
            .project-card,
            .work-outro-card {
              width: 100% !important;
              height: auto !important;
              min-height: 0 !important;
            }
            .project-card-main {
              min-height: 25rem;
            }
            .work-foot {
              display: none !important;
            }
          `}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
