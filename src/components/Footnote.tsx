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
  registerFootnote: (index: string | number | undefined, contentId?: string) => string | number;
  addFootnoteContent: (index: string | number, content: React.ReactNode) => void;
  registrationOrder: (string | number)[];
}>({
  footnotes: new Map(),
  registerFootnote: () => 1,
  addFootnoteContent: () => {},
  registrationOrder: [],
});

// Provider component
export function FootnoteProvider({ children }: { children: React.ReactNode }) {
  const [footnotes, setFootnotes] = React.useState<Map<string | number, React.ReactNode>>(new Map());
  const [counter, setCounter] = React.useState(1);
  const [pendingFootnotes, setPendingFootnotes] = React.useState<Set<string | number>>(new Set());
  const [registrationOrder, setRegistrationOrder] = React.useState<(string | number)[]>([]);
  
  // Map to track content IDs to prevent duplicate auto-indexed footnotes
  const contentIdMapRef = React.useRef<Map<string, string | number>>(new Map());
  
  // Use a ref to track the current counter value without causing re-renders
  const counterRef = React.useRef(1);
  
  // Update the ref when counter state changes
  React.useEffect(() => {
    counterRef.current = counter;
  }, [counter]);

  const registerFootnote = React.useCallback((index: string | number | undefined, contentId?: string): string | number => {
    // If we have a contentId and it's already registered, return the existing index
    if (contentId && contentIdMapRef.current.has(contentId)) {
      const existingIndex = contentIdMapRef.current.get(contentId)!;
      return existingIndex;
    }
    
    if (index !== undefined) {
      setPendingFootnotes(prev => new Set(prev).add(index));
      
      // Add to registration order if not already present
      setRegistrationOrder(prev => prev.includes(index) ? prev : [...prev, index]);
      
      // If we have a contentId, store the mapping
      if (contentId) {
        contentIdMapRef.current.set(contentId, index);
      }
      
      return index;
    }
    
    // Auto-increment for unspecified indexes
    const newIndex = counterRef.current;
    setCounter(prev => prev + 1);
    setPendingFootnotes(prev => new Set(prev).add(newIndex));
    
    // Add to registration order if not already present
    setRegistrationOrder(prev => prev.includes(newIndex) ? prev : [...prev, newIndex]);
    
    // If we have a contentId, store the mapping
    if (contentId) {
      contentIdMapRef.current.set(contentId, newIndex);
    }
    
    return newIndex;
  }, []); 

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
    <FootnoteContext.Provider value={{ 
      footnotes, 
      registerFootnote, 
      addFootnoteContent, 
      registrationOrder
    }}>
      {children}
    </FootnoteContext.Provider>
  );
}

// Footnote reference component
interface FootnoteProps {
  index?: string | number;
  contentId?: string; // Optional ID to link reference with content
}

export function Footnote({ index: propIndex, contentId }: FootnoteProps) {
  const { registerFootnote, footnotes } = React.useContext(FootnoteContext);
  const [index, setIndex] = React.useState<string | number | null>(null);
  
  // Generate a stable contentId if none is provided
  const stableContentIdRef = React.useRef<string | undefined>(
    contentId || (propIndex !== undefined ? `fn-${propIndex}` : undefined)
  );
  
  // Only register the footnote once on mount or when propIndex changes
  React.useEffect(() => {
    const assignedIndex = registerFootnote(propIndex, stableContentIdRef.current);
    setIndex(assignedIndex);
  }, [propIndex, registerFootnote]);

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
          <TooltipContent side="top" className="max-w-sm">
            <div className="text-sm prose prose-sm">
              {content}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

// Footnote content component
export function FootnoteContent({ 
  children, 
  index: propIndex 
}: { 
  children: React.ReactNode; 
  index?: string | number;
}) {
  const { registerFootnote, addFootnoteContent } = React.useContext(FootnoteContext);
  const [index, setIndex] = React.useState<string | number | null>(null);
  
  // Generate a stable contentId if none is provided
  const stableContentIdRef = React.useRef<string | undefined>(
    propIndex !== undefined ? `fn-${propIndex}` : undefined
  );
  
  // Register the footnote content with auto-increment if needed
  React.useEffect(() => {
    const assignedIndex = registerFootnote(propIndex, stableContentIdRef.current);
    setIndex(assignedIndex);
  }, [propIndex, registerFootnote]);
  
  // Once we have an index, add the content
  React.useEffect(() => {
    if (index !== null) {
      addFootnoteContent(index, children);
    }
  }, [addFootnoteContent, children, index]);
  
  return null;
}

// Footnote container component
export function FootnoteContainer() {
  const { footnotes, registrationOrder } = React.useContext(FootnoteContext);

  if (footnotes.size === 0) return null;

  // Use registration order to determine display order
  const footnotesArray = registrationOrder
    .filter(index => footnotes.has(index)) // Only include indices that have content
    .map(index => [index, footnotes.get(index)]);

  return (
    <div className="footnotes mt-8 pt-8 border-t border-muted">
      <div className="space-y-3">
        {footnotesArray.map(([index, content]) => (
          <div key={String(index)} id={`fn-${index}`} className="flex gap-2">
            <div className="font-medium min-w-7 text-right">
              {index}.
            </div>
            <div className="flex-1">
              {content}
              <a 
                href={`#fnref-${index}`}
                className="footnote-backref ml-2"
                aria-label="Back to content"
              >
                ↩
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 