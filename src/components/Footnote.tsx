"use client"

import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname } from 'next/navigation'

export const FootnoteContext = React.createContext<{
  footnotes: Map<string | number, React.ReactNode>;
  registerFootnote: (index: string | number | undefined, contentId?: string, isContent?: boolean) => string | number;
  addFootnoteContent: (index: string | number, content: React.ReactNode) => void;
  registrationOrder: (string | number)[];
  availableIndices: Set<string | number>; // Track indices that have been assigned but not yet paired
  usedPairs: Set<string | number>; // Track indices that have been paired
  contentRegistrationOrder: (string | number)[]; // Track registration order for content separately
}>({
  footnotes: new Map(),
  registerFootnote: () => 1,
  addFootnoteContent: () => {},
  registrationOrder: [],
  availableIndices: new Set(),
  usedPairs: new Set(),
  contentRegistrationOrder: [],
});

// Provider component
export function FootnoteProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [footnotes, setFootnotes] = React.useState<Map<string | number, React.ReactNode>>(new Map());
  const [footnoteCounter, setFootnoteCounter] = React.useState(1);
  const [contentCounter, setContentCounter] = React.useState(1);
  const [_pendingFootnotes, setPendingFootnotes] = React.useState<Set<string | number>>(new Set());
  const [registrationOrder, setRegistrationOrder] = React.useState<(string | number)[]>([]);
  const [contentRegistrationOrder, setContentRegistrationOrder] = React.useState<(string | number)[]>([]);
  
  // Track available indices (assigned to a reference but not yet paired with content)
  const [availableIndices, setAvailableIndices] = React.useState<Set<string | number>>(new Set());
  
  // Track indices that have been successfully paired
  const [usedPairs, setUsedPairs] = React.useState<Set<string | number>>(new Set());
  
  // Map to track content IDs to prevent duplicate auto-indexed footnotes
  const contentIdMapRef = React.useRef<Map<string, string | number>>(new Map());
  
  // Use refs to track the current counter values without causing re-renders
  const footnoteCounterRef = React.useRef(1);
  const contentCounterRef = React.useRef(1);
  
  // Reset all footnote state when pathname changes
  React.useEffect(() => {
    setFootnotes(new Map());
    setFootnoteCounter(1);
    setContentCounter(1);
    setPendingFootnotes(new Set());
    setRegistrationOrder([]);
    setContentRegistrationOrder([]);
    setAvailableIndices(new Set());
    setUsedPairs(new Set());
    contentIdMapRef.current = new Map();
    footnoteCounterRef.current = 1;
    contentCounterRef.current = 1;
  }, [pathname]);
  
  // Update the refs when counter states change
  React.useEffect(() => {
    footnoteCounterRef.current = footnoteCounter;
  }, [footnoteCounter]);

  React.useEffect(() => {
    contentCounterRef.current = contentCounter;
  }, [contentCounter]);

  const registerFootnote = React.useCallback((
    index: string | number | undefined, 
    contentId?: string,
    isContent: boolean = false
  ): string | number => {
    // If we have a contentId and it's already registered, return the existing index
    if (contentId && contentIdMapRef.current.has(contentId)) {
      const existingIndex = contentIdMapRef.current.get(contentId)!;
      return existingIndex;
    }
    
    // If an explicit index was provided
    if (index !== undefined) {
      // Update tracking sets based on whether this is a reference or content
      if (isContent) {
        // This is content for an existing reference
        if (availableIndices.has(index)) {
          setAvailableIndices(prev => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
          });
          setUsedPairs(prev => new Set(prev).add(index));
        }
        
        // Add to content registration order if not already present
        setContentRegistrationOrder(prev => prev.includes(index) ? prev : [...prev, index]);
      } else {
        // This is a reference that might need content
        setAvailableIndices(prev => new Set(prev).add(index));
        
        // Add to footnote registration order if not already present
        setRegistrationOrder(prev => prev.includes(index) ? prev : [...prev, index]);
      }
      
      setPendingFootnotes(prev => new Set(prev).add(index));
      
      // If we have a contentId, store the mapping
      if (contentId) {
        contentIdMapRef.current.set(contentId, index);
      }
      
      return index;
    }
    
    // Auto-increment case - first check if we have available indices to pair with
    if (isContent && availableIndices.size > 0) {
      // Get the first available index for content
      const nextIndex = Array.from(availableIndices)[0];
      
      // Remove from available and mark as used
      setAvailableIndices(prev => {
        const newSet = new Set(prev);
        newSet.delete(nextIndex);
        return newSet;
      });
      setUsedPairs(prev => new Set(prev).add(nextIndex));
      
      // Add to content registration order
      setContentRegistrationOrder(prev => prev.includes(nextIndex) ? prev : [...prev, nextIndex]);
      
      // If we have a contentId, store the mapping
      if (contentId) {
        contentIdMapRef.current.set(contentId, nextIndex);
      }
      
      return nextIndex;
    }
    
    // No available indices or this is a new reference - generate a new one
    // Use the appropriate counter based on isContent
    const newIndex = isContent ? contentCounterRef.current : footnoteCounterRef.current;
    
    // Immediately update the appropriate ref to prevent duplicate indices
    if (isContent) {
      contentCounterRef.current += 1;
      setContentCounter(contentCounterRef.current);
    } else {
      footnoteCounterRef.current += 1;
      setFootnoteCounter(footnoteCounterRef.current);
    }
    
    setPendingFootnotes(prev => new Set(prev).add(newIndex));
    
    // For references, mark as available for pairing
    // For content, it's already paired (unusual case - content before reference)
    if (!isContent) {
      setAvailableIndices(prev => new Set(prev).add(newIndex));
      // Add to footnote registration order
      setRegistrationOrder(prev => [...prev, newIndex]);
    } else {
      setUsedPairs(prev => new Set(prev).add(newIndex));
      // Add to content registration order
      setContentRegistrationOrder(prev => [...prev, newIndex]);
    }
    
    // If we have a contentId, store the mapping
    if (contentId) {
      contentIdMapRef.current.set(contentId, newIndex);
    }
    
    return newIndex;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove availableIndices from dependencies to prevent recreation

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
    
    // Mark as a used pair since it now has content
    setAvailableIndices(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    setUsedPairs(prev => new Set(prev).add(index));
    
    // Ensure it's in the content registration order
    setContentRegistrationOrder(prev => prev.includes(index) ? prev : [...prev, index]);
  }, []);

  return (
    <FootnoteContext.Provider value={{ 
      footnotes, 
      registerFootnote, 
      addFootnoteContent, 
      registrationOrder,
      availableIndices,
      usedPairs,
      contentRegistrationOrder
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
    contentId || (propIndex !== undefined ? `fn-index-${propIndex}` : undefined)
  );
  
  // Only register the footnote once on mount or when propIndex changes
  React.useEffect(() => {
    const assignedIndex = registerFootnote(propIndex, stableContentIdRef.current, false);
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
              data-content-id={stableContentIdRef.current}
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
    propIndex !== undefined ? `fn-index-${propIndex}` : undefined
  );
  
  // Store the initial children value in a ref to prevent re-adding on rerenders
  const initialChildrenRef = React.useRef(children);
  
  // Store whether content has been added to prevent re-adding
  const contentAddedRef = React.useRef(false);
  
  // Register the footnote content with auto-increment if needed
  React.useEffect(() => {
    const assignedIndex = registerFootnote(propIndex, stableContentIdRef.current, true);
    setIndex(assignedIndex);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propIndex]); // Remove registerFootnote from dependencies
  
  // Once we have an index, add the content
  React.useEffect(() => {
    if (index !== null && !contentAddedRef.current) {
      addFootnoteContent(index, initialChildrenRef.current);
      contentAddedRef.current = true; // Mark content as added to prevent re-adding
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]); // Remove addFootnoteContent from dependencies
  
  return null;
}

// Footnote container component
export function FootnoteContainer() {
  const { footnotes, contentRegistrationOrder } = React.useContext(FootnoteContext);

  if (footnotes.size === 0) return null;

  // Use content registration order to determine display order since it tracks actual content
  const footnotesArray = contentRegistrationOrder
    .filter(index => footnotes.has(index)) // Only include indices that have content
    .map(index => [index, footnotes.get(index)]);
  
  console.log(footnotesArray);

  return (
    <div className="footnotes mt-8 pt-8 border-t border-muted">
      <div className="space-y-3">
        {footnotesArray.map(([index, content]) => (
          <div key={"content-" + String(index)} id={`fn-${index}`} className="flex gap-2">
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