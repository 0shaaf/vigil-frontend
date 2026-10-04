import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "VIGIL // Autonomous Dead-Man's Switch & Digital Sentinel",
  description:
    "An autonomous contingency sentinel watching over your infrastructure, secrets, and emergency directives before calamity claims the night. When silence is the trigger.",
  keywords: [
    "Dead Man's Switch",
    "Sentinel",
    "Infrastructure Security",
    "Fail-Safe Webhook",
    "Cryptographic Disclosures",
    "Google Drive Vault",
  ],
  authors: [{ name: "Shaaf" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="vigil-root bg-[#030305] text-[#f0f4fc] selection:bg-[#ff3b19] selection:text-black antialiased">
        {/* Subtle CRT Scanline overlay */}
        <div className="crt-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
