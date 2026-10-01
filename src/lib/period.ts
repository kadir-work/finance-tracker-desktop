import { formatMonthYear, getDayInputValue } from "./format";
import type { ReportPeriodType } from "./types";

export function getPeriodRange(
  periodType: ReportPeriodType,
  input: { day?: string; month?: string; year?: string } = {},
  today = new Date(),
) {
  if (periodType === "last30days") {
    // Include today and the preceding 29 local calendar days. The end is exclusive.
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const dateFormat = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
    return {
      periodType,
      label: `Son 30 gun (${dateFormat.format(start)} – ${dateFormat.format(today)})`,
      start,
      end,
    };
  }

  if (periodType === "all") {
    return {
      periodType,
      label: "Tum donemler",
      start: null,
      end: null,
    };
  }

  if (periodType === "daily") {
    const dayValue = input.day ?? getDayInputValue(today);
    const [year, month, day] = dayValue.split("-").map(Number);
    const start = new Date(year, month - 1, day);
    const end = new Date(year, month - 1, day + 1);

    return {
      periodType,
      label: new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(start),
      start,
      end,
    };
  }

  if (periodType === "yearly") {
    const year = Number(input.year ?? today.getFullYear());
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    return {
      periodType,
      label: `${year}`,
      start,
      end,
    };
  }

  const [year, month] = (input.month ?? `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, "0")}`)
    .split("-")
    .map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return {
    periodType: "monthly" as const,
    label: formatMonthYear(year, month),
    start,
    end,
  };
}
