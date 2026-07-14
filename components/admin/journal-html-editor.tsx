"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { sanitizeJournalHtml } from "@/lib/journal-content";

export function JournalHtmlEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"visual" | "html">("visual");

  useEffect(() => {
    document.execCommand("defaultParagraphSeparator", false, "p");
  }, []);

  const syncValue = useCallback(() => {
    onChange(editorRef.current?.innerHTML ?? "");
  }, [onChange]);

  const runCommand = useCallback(
    (command: string, commandValue?: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false, commandValue);
      syncValue();
    },
    [syncValue]
  );

  const handleLink = useCallback(() => {
    const url = window.prompt("Link URL");
    if (!url) return;
    runCommand("createLink", url);
  }, [runCommand]);

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      document.execCommand(
        "insertText",
        false,
        event.clipboardData.getData("text/plain")
      );
      syncValue();
    },
    [syncValue]
  );

  const toolbarButton =
    "rounded-md border border-warm-200 bg-white px-2 py-1 text-xs text-foreground hover:border-navy/30";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-lg border border-warm-200 bg-warm-50 px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          {mode === "visual" && (
            <>
              <select
                aria-label="Text style"
                onChange={(event) => runCommand("formatBlock", event.target.value)}
                defaultValue="p"
                className="rounded-md border border-warm-200 bg-white px-2 py-1 text-xs text-foreground focus:outline-none focus:border-navy/30"
              >
                <option value="p">Paragraph</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="blockquote">Quote</option>
              </select>
              <button
                type="button"
                onClick={() => runCommand("bold")}
                className={`${toolbarButton} font-semibold`}
                aria-label="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => runCommand("italic")}
                className={`${toolbarButton} italic`}
                aria-label="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => runCommand("insertUnorderedList")}
                className={toolbarButton}
              >
                Bullets
              </button>
              <button
                type="button"
                onClick={() => runCommand("insertOrderedList")}
                className={toolbarButton}
              >
                Numbers
              </button>
              <button type="button" onClick={handleLink} className={toolbarButton}>
                Link
              </button>
            </>
          )}
        </div>

        <div className="flex rounded-md border border-warm-200 bg-white p-0.5">
          <button
            type="button"
            onClick={() => {
              const safeHtml = sanitizeJournalHtml(value);
              onChange(safeHtml);
              setMode("visual");
            }}
            className={`rounded px-2 py-1 text-[11px] ${
              mode === "visual" ? "bg-navy text-white" : "text-foreground-muted"
            }`}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => {
              syncValue();
              setMode("html");
            }}
            className={`rounded px-2 py-1 text-[11px] ${
              mode === "html" ? "bg-navy text-white" : "text-foreground-muted"
            }`}
          >
            HTML
          </button>
        </div>
      </div>

      {mode === "visual" ? (
        <div
          ref={editorRef}
          key="visual-editor"
          contentEditable
          suppressContentEditableWarning
          onInput={syncValue}
          onBlur={syncValue}
          onPaste={handlePaste}
          className="min-h-[620px] w-full rounded-b-lg border-x border-b border-warm-200 bg-white px-5 py-4 text-sm leading-relaxed text-foreground focus:outline-none focus:border-navy/30 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-navy [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2:first-child]:mt-0 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-navy [&_h3]:tracking-tight [&_h3]:mt-5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-gold [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <textarea
          key="html-editor"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          aria-label="Article HTML"
          className="min-h-[620px] w-full resize-y rounded-b-lg border-x border-b border-warm-200 bg-[#172131] px-5 py-4 font-mono text-sm leading-relaxed text-cream focus:outline-none focus:border-gold/50"
          placeholder="<p>Write your article here...</p>"
        />
      )}
    </div>
  );
}
