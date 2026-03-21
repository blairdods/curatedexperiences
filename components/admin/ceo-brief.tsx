"use client";

import Markdown from "react-markdown";

export function CeoBrief({
  content,
  createdAt,
}: {
  content: string;
  createdAt: string;
}) {
  return (
    <>
      <div className="text-sm text-foreground/80 leading-relaxed prose-sm prose-headings:font-serif prose-headings:text-navy prose-headings:tracking-tight prose-h1:text-lg prose-h2:text-base prose-h2:mt-5 prose-h2:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-foreground max-w-none">
        <Markdown>{content}</Markdown>
      </div>
      <p className="text-xs text-warm-400 mt-4">
        {new Date(createdAt).toLocaleDateString("en-NZ", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </>
  );
}
