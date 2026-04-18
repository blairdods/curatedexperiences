"use client";

import { useState } from "react";

interface TagInputProps {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-warm-100 text-foreground"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-foreground-muted hover:text-foreground"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder ?? "Type and press Enter"}
          className="flex-1 px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg
            focus:outline-none focus:border-navy/30"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2 text-xs bg-warm-100 text-foreground-muted rounded-lg hover:bg-warm-200 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
