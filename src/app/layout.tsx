import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';
import clouds from '@/app/clouds.png'
import Link from "next/link";
import 'katex/dist/katex.min.css'
import EmailLink from '@/components/EmailLink';
import DiscordPopup from '@/components/DiscordPopup';
import { FootnoteProvider, FootnoteContainer } from '@/components/FootnoteContainer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s - aurelium',
    default: 'aurelium'
  },
  icons: {
    icon: '/favicon.png'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FootnoteProvider>
          <div className="container">
            <header>
              <div className="header-content">
                <Link className="brand-container" href="/">
                  <Image src={clouds} alt="clouds logo" width={24} height={24} id="clouds-header" />
                  <div className="brand">aurelium</div>
                </Link>
                <nav>
                  <Link href="/blog" className="nav-link">blog</Link>
                </nav>
              </div>
            </header>

            <main className="main-content">
                <article className="prose prose-invert max-w-none">
                  {children}
                </article>
                <FootnoteContainer />
            </main>

            <footer className="footer">
              <svg viewBox="0 0 24 24" width="48" height="48" className="footer-brand">
                <path fill="currentColor" d="M12 2L1.5 7.5L4.5 9.3C3.6 10.2 3 11.5 3 13C3 15.8 5.2 18 8 18C8.8 18 9.5 17.8 10.2 17.5L12 22L22.5 16.5L19.5 14.7C20.4 13.8 21 12.5 21 11C21 8.2 18.8 6 16 6C15.2 6 14.5 6.2 13.8 6.5L12 2M8 8C10.2 8 12 9.8 12 12C12 14.2 10.2 16 8 16C5.8 16 4 14.2 4 12C4 9.8 5.8 8 8 8M16 8C18.2 8 20 9.8 20 12C20 14.2 18.2 16 16 16C13.8 16 12 14.2 12 12C12 9.8 13.8 8 16 8Z" />
              </svg>
              <div className="social-links">
                <Link href="https://github.com/AutumnAurelium" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faGithub} />
                </Link>
                <EmailLink />
                <DiscordPopup />
                <Link href="https://x.com/ariaurelium" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faXTwitter} />
                </Link>
              </div>
              <div className="copyright">© aurelium 2024</div>
            </footer>
          </div>
        </FootnoteProvider>
      </body>
    </html>
  );
}
