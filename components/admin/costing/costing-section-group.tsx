"use client";

import type { CostingLineItem, CostingLineItemInput } from "@/lib/costing/types";
import { CostingSection } from "./costing-section";

interface SectionData {
  id: string;
  name: string;
  items: CostingLineItem[];
  subtotalNetNzd: number;
  subtotalGrossNzd: number;
}

interface Props {
  sections: SectionData[];
  pax: number | null;
  onAddItem: (sectionId: string, input: CostingLineItemInput) => void;
  onDeleteItem: (sectionId: string, itemId: string) => void;
  disabled?: boolean;
}

export function CostingSectionGroup({
  sections,
  pax,
  onAddItem,
  onDeleteItem,
  disabled,
}: Props) {
  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <CostingSection
          key={section.id}
          name={section.name}
          items={section.items}
          subtotalNetNzd={section.subtotalNetNzd}
          subtotalGrossNzd={section.subtotalGrossNzd}
          pax={pax}
          onAddItem={(input) => onAddItem(section.id, input)}
          onDeleteItem={(itemId) => onDeleteItem(section.id, itemId)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
