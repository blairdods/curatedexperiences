"use client";

import { useState } from "react";

interface ListEditorProps {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}

export function ListEditor({ value, onChange, placeholder }: ListEditorProps) {
  const [input, setInput] = useState("");

  const addItem = () => {
    const item = input.trim();
    if (item) {
      onChange([...value, item]);
      setInput("");
    }
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const items = [...value];
    const [moved] = items.splice(from, 1);
    items.splice(to, 0, moved);
    onChange(items);
  };

  return (
    <div>
      <div className="space-y-1.5 mb-2">
        {value.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-warm-50 rounded-lg px-3 py-2"
          >
            <span className="flex-1 text-sm text-foreground">{item}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveItem(i, i - 1)}
                disabled={i === 0}
                className="text-foreground-muted hover:text-foreground disabled:opacity-30 text-xs"
              >
                &uarr;
              </button>
              <button
                type="button"
                onClick={() => moveItem(i, i + 1)}
                disabled={i === value.length - 1}
                className="text-foreground-muted hover:text-foreground disabled:opacity-30 text-xs"
              >
                &darr;
              </button>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-red-400 hover:text-red-600 text-xs ml-1"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder ?? "Add item and press Enter"}
          className="flex-1 px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg
            focus:outline-none focus:border-navy/30"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-2 text-xs bg-warm-100 text-foreground-muted rounded-lg hover:bg-warm-200 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
