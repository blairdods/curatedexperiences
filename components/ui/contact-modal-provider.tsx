"use client";

import { useState, useEffect, useCallback } from "react";
import { ContactModal } from "./contact-modal";

export function ContactModalProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<string | undefined>();

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setContext(detail?.context);
      setIsOpen(true);
    };
    window.addEventListener("ce:open-contact", handler);
    return () => window.removeEventListener("ce:open-contact", handler);
  }, []);

  return (
    <ContactModal isOpen={isOpen} onClose={close} context={context} />
  );
}
