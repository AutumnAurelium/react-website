"use client"

import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FootnoteContext } from './FootnoteContainer'

interface FootnoteProps {
  content: string;
  index: number;
}

export function Footnote({ content, index }: FootnoteProps) {
  const { addFootnote } = React.useContext(FootnoteContext);

  React.useEffect(() => {
    addFootnote({ content, index });
  }, [addFootnote, content, index]);

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
        <TooltipContent>
          <span className="text-sm">{content}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 