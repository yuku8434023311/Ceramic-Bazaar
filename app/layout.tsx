import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import { Providers } from './providers'
import AppLockWrapper from '@/components/site/app-lock-wrapper'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { DelayedScript } from '@/components/site/delayed-script'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://ceramicbazaar.com'),
  title: 'Ceramic Bazaar - Premium Tiles, Sanitary Ware & Home Improvement',
  description: 'Shop premium tiles, sanitary ware, bathroom fittings, granite, marble, plumbing, hardware & tools at wholesale prices from Ceramic Bazaar.',
  icons: { 
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/app-icon.png', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png' 
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Ceramic Bazaar',
    description: 'Premium Tiles, Sanitary Ware & Home Improvement Store',
    images: ['/logo.png'],
  },
}

import { OfflineScreen } from '@/components/site/offline-screen'
import { PermissionPrompt } from '@/components/site/permission-prompt'
import { LiveSupportWidget } from '@/components/site/live-support-widget'
import { InAppUpdateModal } from '@/components/site/in-app-update-modal'
import { AppExitModal } from '@/components/site/app-exit-modal'
import { FlyToCartContainer } from '@/components/site/fly-to-cart'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ceramic Bazaar" />
      </head>
      <body className={`${dmSans.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
          <Providers>
            <AppLockWrapper>
              {children}
            </AppLockWrapper>
            <Toaster />
            <ChunkLoadErrorHandler />
            <OfflineScreen />
            <PermissionPrompt />
            <LiveSupportWidget />
            <InAppUpdateModal />
            <AppExitModal />
            <FlyToCartContainer />
          </Providers>
        </ThemeProvider>
        <DelayedScript />
      </body>
    </html>
  )
}

