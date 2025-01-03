"use client"

import React from 'react'

interface FootnoteData {
  content: string;
  index: number;
}

export const FootnoteContext = React.createContext<{
  footnotes: FootnoteData[];
  addFootnote: (footnote: FootnoteData) => void;
}>({
  footnotes: [],
  addFootnote: () => {},
});

export function FootnoteProvider({ children }: { children: React.ReactNode }) {
  const [footnotes, setFootnotes] = React.useState<FootnoteData[]>([]);

  const addFootnote = React.useCallback((footnote: FootnoteData) => {
    setFootnotes(prev => {
      // Check if footnote already exists
      if (prev.some(f => f.index === footnote.index)) {
        return prev;
      }
      return [...prev, footnote].sort((a, b) => a.index - b.index);
    });
  }, []);

  return (
    <FootnoteContext.Provider value={{ footnotes, addFootnote }}>
      {children}
    </FootnoteContext.Provider>
  );
}

export function FootnoteContainer() {
  const { footnotes } = React.useContext(FootnoteContext);

  if (footnotes.length === 0) return null;

  return (
    <div className="footnotes">
      <ol>
        {footnotes.map(({ content, index }) => (
          <li key={index} id={`fn-${index}`}>
            {content}
            <a 
              href={`#fnref-${index}`}
              className="footnote-backref ml-2"
              aria-label="Back to content"
            >
              ↩
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
} 