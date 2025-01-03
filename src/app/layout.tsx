import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faDiscord, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import clouds from '@/app/clouds.png'
import Link from "next/link";
import 'katex/dist/katex.min.css'

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
        <div className="container">
          <header>
            <div className="header-content">
              <Link className="brand-container" href="/">
                <Image src={clouds} alt="clouds logo" width={24} height={24} id="clouds-header" />
                <div className="brand">aurelium</div>
              </Link>
              <nav>
                <a href="/blog" className="nav-link">blog</a>
              </nav>
            </div>
          </header>

          <main className="main-content">
            <article className="prose prose-invert max-w-none">
              {children}
            </article>
          </main>

          <footer className="footer">
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a href="mailto:example@example.com">
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faDiscord} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
            </div>
            <div className="copyright">© aurelium 2024</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
