import type { Metadata } from "next";
import { Noto_Sans_JP, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://dateplan.app'),
  title: {
    default: "AIデートプラン | 名古屋・東京のデートをAIが提案",
    template: "%s | AIデートプラン",
  },
  description: "条件を細かく設定できるAIデートプランジェネレーター。名古屋・東京のおすすめデートコースを30秒で生成。無料で月3プランまで。",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'AIデートプラン',
    images: [
      {
        url: '/api/og?title=AIデートプラン&area=名古屋・東京',
        width: 1200,
        height: 630,
        alt: 'AIデートプラン — 名古屋・東京のデートをAIが提案',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og?title=AIデートプラン&area=名古屋・東京'],
  },
  verification: {
    google: '',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${montserrat.variable} ${notoSansJP.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
