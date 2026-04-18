"use client";

import { FormField, TextInput, TextArea } from "@/components/admin/ui/form-field";
import { ListEditor } from "@/components/admin/ui/list-editor";

export interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  description: string;
  activities: string[];
  accommodation: string;
}

interface ItineraryDayEditorProps {
  day: ItineraryDay;
  onChange: (day: ItineraryDay) => void;
  onRemove: () => void;
}

export function ItineraryDayEditor({
  day,
  onChange,
  onRemove,
}: ItineraryDayEditorProps) {
  return (
    <div className="bg-warm-50 rounded-xl p-5 border border-warm-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">
          Day {day.day}
        </h3>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          Remove day
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Title">
          <TextInput
            value={day.title}
            onChange={(v) => onChange({ ...day, title: v })}
            placeholder="Day title..."
          />
        </FormField>
        <FormField label="Location">
          <TextInput
            value={day.location}
            onChange={(v) => onChange({ ...day, location: v })}
            placeholder="Location..."
          />
        </FormField>
      </div>

      <div className="mt-4">
        <FormField label="Description">
          <TextArea
            value={day.description}
            onChange={(v) => onChange({ ...day, description: v })}
            placeholder="What happens on this day..."
            rows={3}
          />
        </FormField>
      </div>

      <div className="mt-4">
        <FormField label="Activities">
          <ListEditor
            value={day.activities}
            onChange={(v) => onChange({ ...day, activities: v })}
            placeholder="Add activity..."
          />
        </FormField>
      </div>

      <div className="mt-4">
        <FormField label="Accommodation">
          <TextInput
            value={day.accommodation}
            onChange={(v) => onChange({ ...day, accommodation: v })}
            placeholder="Lodge / hotel name..."
          />
        </FormField>
      </div>
    </div>
  );
}
