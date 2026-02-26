import type { Metadata } from 'next';
import { Sora, Space_Grotesk } from 'next/font/google';
import { ReactLenis } from 'lenis/react';

import 'lenis/dist/lenis.css';
import './globals.css';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import Preloader from '../components/Preloader';
import StickyEmail from './_components/StickyEmail';
import { SITE_NAME, SITE_URL } from '@/lib/site';

const soraFont = Sora({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-sora',
});

const spaceGrotesk = Space_Grotesk({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} | Full-Stack Developer`,
        template: `%s | ${SITE_NAME}`,
    },
    description:
        'Full-stack developer focused on scalable architectures and intelligent backend systems.',
    openGraph: {
        title: `${SITE_NAME} | Full-Stack Developer`,
        description:
            'Full-stack developer focused on scalable architectures and intelligent backend systems.',
        url: SITE_URL,
        siteName: SITE_NAME,
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} | Full-Stack Developer`,
        description:
            'Full-stack developer focused on scalable architectures and intelligent backend systems.',
    },
    icons: {
        icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
        shortcut: '/icon.svg',
        apple: '/icon.svg',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${soraFont.variable} ${spaceGrotesk.variable} antialiased`}
            >
                <ReactLenis
                    root
                    options={{
                        lerp: 0.09,
                        duration: 1.15,
                    }}
                >
                    <Navbar />
                    <main className="relative z-[1]">{children}</main>
                    <Footer />

                    <CustomCursor />
                    <Preloader />
                    <ScrollProgressIndicator />
                    <ParticleBackground />
                    <StickyEmail />
                </ReactLenis>
            </body>
        </html>
    );
}
