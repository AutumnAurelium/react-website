"use client"

import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Context definition
interface FootnoteData {
  content: React.ReactNode;
  index: string | number;
}

export const FootnoteContext = React.createContext<{
  footnotes: Map<string | number, React.ReactNode>;
  registerFootnote: (index: string | number | undefined) => string | number;
  addFootnoteContent: (index: string | number, content: React.ReactNode) => void;
}>({
  footnotes: new Map(),
  registerFootnote: () => 1,
  addFootnoteContent: () => {},
});

// Provider component
export function FootnoteProvider({ children }: { children: React.ReactNode }) {
  const [footnotes, setFootnotes] = React.useState<Map<string | number, React.ReactNode>>(new Map());
  const [counter, setCounter] = React.useState(1);
  const [pendingFootnotes, setPendingFootnotes] = React.useState<Set<string | number>>(new Set());

  const registerFootnote = React.useCallback((index: string | number | undefined): string | number => {
    if (index !== undefined) {
      setPendingFootnotes(prev => new Set(prev).add(index));
      return index;
    }
    
    // Auto-increment for unspecified indexes
    const newIndex = counter;
    setCounter(prev => prev + 1);
    setPendingFootnotes(prev => new Set(prev).add(newIndex));
    return newIndex;
  }, [counter]);

  const addFootnoteContent = React.useCallback((index: string | number, content: React.ReactNode) => {
    setFootnotes(prev => {
      const newMap = new Map(prev);
      newMap.set(index, content);
      return newMap;
    });
    
    // Remove from pending once content is provided
    setPendingFootnotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  }, []);

  return (
    <FootnoteContext.Provider value={{ footnotes, registerFootnote, addFootnoteContent }}>
      {children}
    </FootnoteContext.Provider>
  );
}

// Footnote reference component
interface FootnoteProps {
  index?: string | number;
}

export function Footnote({ index: propIndex }: FootnoteProps) {
  const { registerFootnote, footnotes } = React.useContext(FootnoteContext);
  const [index, setIndex] = React.useState<string | number | null>(null);
  
  React.useEffect(() => {
    const assignedIndex = registerFootnote(propIndex);
    setIndex(assignedIndex);
  }, [registerFootnote, propIndex]);

  if (index === null) return null;
  
  // Get the content from footnotes Map if available (for tooltip)
  const content = footnotes.get(index);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <sup>
            <a 
              href={`#fn-${index}`}
              id={`fnref-${index}`}
              className="text-primary hover:text-primary-light transition-colors"
            >
              {index}
            </a>
          </sup>
        </TooltipTrigger>
        {content && (
          <TooltipContent>
            <span className="text-sm">{typeof content === 'string' ? content : 'See footnote'}</span>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

// Footnote content component
export function FootnoteContent({ 
  children, 
  index 
}: { 
  children: React.ReactNode; 
  index: string | number;
}) {
  const { addFootnoteContent } = React.useContext(FootnoteContext);
  
  React.useEffect(() => {
    // Store the React node directly without converting to string
    addFootnoteContent(index, children);
  }, [addFootnoteContent, children, index]);
  
  return null;
}

// Footnote container component
export function FootnoteContainer() {
  const { footnotes } = React.useContext(FootnoteContext);

  if (footnotes.size === 0) return null;

  // Convert map to array and sort
  const footnotesArray = Array.from(footnotes.entries())
    .sort((a, b) => {
      // Sort numerically if both are numbers
      if (typeof a[0] === 'number' && typeof b[0] === 'number') {
        return a[0] - b[0];
      }
      // Otherwise sort by string representation
      return String(a[0]).localeCompare(String(b[0]));
    });

  return (
    <div className="footnotes mt-8 pt-8 border-t border-muted">
      <ol>
        {footnotesArray.map(([index, content]) => (
          <li key={String(index)} id={`fn-${index}`}>
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