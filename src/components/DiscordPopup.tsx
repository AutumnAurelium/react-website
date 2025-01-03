"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DiscordPopup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-primary hover:text-primary-light transition-colors">
          <FontAwesomeIcon icon={faDiscord} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[var(--background-dark)] border-[var(--primary)] text-[var(--foreground)]">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-primary">Discord</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>You can find me on Discord as <code className="bg-[var(--background)] px-2 py-1 rounded border border-[var(--primary-transparent)]">autumnaurelium</code></p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 