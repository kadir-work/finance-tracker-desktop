"use client";

import { Printer } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type PrintOption = {
  id: string;
  label: string;
};

interface PrintMenuProps {
  options: PrintOption[];
  onSelect: (optionId: string) => void;
  placeholder?: string;
  className?: string;
}

export function PrintMenu({
  options,
  onSelect,
  placeholder = "Yazdır Seçeneği",
  className = "",
}: PrintMenuProps) {
  return (
    <Select value="" onValueChange={(val) => onSelect(val)}>
      <SelectTrigger className={`w-[200px] print:hidden bg-primary text-primary-foreground hover:bg-primary/90 font-medium ${className}`}>
        <Printer className="mr-2 h-4 w-4 shrink-0" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.id} value={opt.id}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
