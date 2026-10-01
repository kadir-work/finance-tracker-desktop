import assert from "node:assert/strict";
import test from "node:test";
import { getPeriodRange } from "../src/lib/period";
import { getDayInputValue } from "../src/lib/format";

test("last 30 days includes today and crosses the month boundary", () => {
  const range = getPeriodRange("last30days", {}, new Date(2026, 9, 1, 18));
  assert.equal(getDayInputValue(range.start!), "2026-09-02");
  assert.equal(getDayInputValue(range.end!), "2026-10-02");
  assert.match(range.label, /02\.09\.2026.*01\.10\.2026/);
  const includes = (date: Date) => date >= range.start! && date < range.end!;
  assert.equal(includes(new Date(2026, 8, 1, 23, 59, 59)), false);
  assert.equal(includes(new Date(2026, 8, 2)), true);
  assert.equal(includes(new Date(2026, 9, 1, 23, 59, 59)), true);
  assert.equal(includes(new Date(2026, 9, 2)), false);
});

test("rolling periods include exactly 30 calendar dates across years, leap years and DST", () => {
  for (const today of [new Date(2026, 0, 1), new Date(2024, 2, 1), new Date(2026, 2, 15), new Date(2026, 10, 5)]) {
    const range = getPeriodRange("last30days", {}, today);
    const cursor = new Date(range.start!);
    let days = 0;
    while (cursor < range.end!) {
      days++;
      cursor.setDate(cursor.getDate() + 1);
    }
    assert.equal(days, 30);
    assert.equal(range.start!.getHours(), 0);
    assert.equal(range.end!.getHours(), 0);
  }
});

test("explicit months, days, years and all periods keep their boundaries", () => {
  const month = getPeriodRange("monthly", { month: "2026-09" });
  assert.equal(getDayInputValue(month.start!), "2026-09-01");
  assert.equal(getDayInputValue(month.end!), "2026-10-01");
  const day = getPeriodRange("daily", { day: "2026-10-01" });
  assert.equal(getDayInputValue(day.start!), "2026-10-01");
  assert.equal(getDayInputValue(day.end!), "2026-10-02");
  const year = getPeriodRange("yearly", { year: "2026" });
  assert.equal(getDayInputValue(year.start!), "2026-01-01");
  assert.equal(getDayInputValue(year.end!), "2027-01-01");
  const all = getPeriodRange("all");
  assert.equal(all.start, null);
  assert.equal(all.end, null);
});

test("default daily period uses the local date near midnight", () => {
  const today = new Date(2026, 9, 1, 0, 5);
  const range = getPeriodRange("daily", {}, today);
  assert.equal(getDayInputValue(range.start!), "2026-10-01");
});
