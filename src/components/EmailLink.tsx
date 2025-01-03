'use client';

import { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function EmailLink() {
  const decodeEmail = useCallback(() => {
    const encoded = "YXJpYS5hdXJlbGl1bUBnbWFpbC5jb20=";
    return atob(encoded);
  }, []);

  return (
    <a
      href={`mailto:${decodeEmail()}`}
      onClick={(e) => {
        e.preventDefault();
        window.location.href = `mailto:${decodeEmail()}`;
      }}
    >
      <FontAwesomeIcon icon={faEnvelope} />
    </a>
  );
} 