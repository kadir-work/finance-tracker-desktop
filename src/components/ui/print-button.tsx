"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrintButtonProps {
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function PrintButton({
  label = "Yazdır",
  variant = "outline",
  size = "default",
  className,
}: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handlePrint}
      className={`print:hidden flex items-center gap-2 ${className ?? ""}`}
    >
      <Printer className="h-4 w-4" />
      {label && <span>{label}</span>}
    </Button>
  );
}
