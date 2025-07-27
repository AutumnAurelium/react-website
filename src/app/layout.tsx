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
import { FootnoteProvider, FootnoteContainer } from '@/components/Footnote';
import SymbolThing from '@/svg/symbol.svg'

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
        <meta name="darkreader-lock" content="true" />
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
              <SymbolThing className="footer-brand" />
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
