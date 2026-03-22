"use client";

import { openContactModal } from "./contact-modal";

export function FooterContactLink() {
  return (
    <button
      onClick={() => openContactModal()}
      className="text-sm text-white/70 hover:text-white transition-colors text-left"
    >
      Contact
    </button>
  );
}
