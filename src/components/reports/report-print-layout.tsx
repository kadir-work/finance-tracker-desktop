"use client";

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/format";
import type { MonthlyReportData } from "@/lib/types";

interface ReportPrintLayoutProps {
  scope: "all" | "summary" | "categories" | "comparison";
  report: MonthlyReportData | null;
  categoryName: string;
  leftReport: MonthlyReportData | null;
  rightReport: MonthlyReportData | null;
  leftCategoryName: string;
  rightCategoryName: string;
  comparisonMode: string;
}

export function ReportPrintLayout({
  scope, report, categoryName, leftReport, rightReport,
  leftCategoryName, rightCategoryName, comparisonMode,
}: ReportPrintLayoutProps) {
  const showSummary = scope === "all" || scope === "summary";
  const showCategories = scope === "all" || scope === "categories";
  const showComparison = scope === "all" || scope === "comparison";
  const metrics = [
    { key: "income", label: "Gelir" },
    { key: "expense", label: "Gider" },
    { key: "net", label: "Net sonuc" },
  ] as const;

  return (
    <article className="print-only report-print" data-print-scope={scope}>
      <header className="report-print-title">
        <h2>{scope === "comparison" ? "Donem Karsilastirmasi" : "Raporlar"}</h2>
        {scope !== "comparison" && <p>{report?.periodLabel ?? "Secili donem"} • {categoryName}</p>}
      </header>

      {showSummary && (
        <section className="report-print-summary">
          <div className="report-print-totals">
            {metrics.map(({ key, label }) => (
              <div key={key}>
                <p>{label}</p>
                <strong>{formatCurrency(report?.totals[key] ?? 0)}</strong>
              </div>
            ))}
          </div>
          <h3>Donem hareketi</h3>
          {report?.dailyTrend.length ? (
            <div className="report-print-chart">
              <BarChart width={700} height={180} data={report.dailyTrend} margin={{ top: 8, right: 8, bottom: 0, left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} minTickGap={12} />
                <YAxis width={65} tick={{ fontSize: 10 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="income" fill="#2a9d8f" name="Gelir" isAnimationActive={false} />
                <Bar dataKey="expense" fill="#e76f51" name="Gider" isAnimationActive={false} />
              </BarChart>
            </div>
          ) : <p>Secilen donem icin rapor verisi yok.</p>}
        </section>
      )}

      {showCategories && (
        <section className="report-print-categories">
          <h3>Kategori bazli toplamlar</h3>
          <table>
            <thead><tr><th scope="col">Kategori</th><th scope="col">Gelir</th><th scope="col">Gider</th><th scope="col">Net sonuc</th></tr></thead>
            <tbody>
              {report?.byCategory.length ? report.byCategory.map((item) => (
                <tr key={item.category}>
                  <th scope="row">{item.category}</th>
                  <td>{formatCurrency(item.income)}</td>
                  <td>{formatCurrency(item.expense)}</td>
                  <td>{formatCurrency(item.net)}</td>
                </tr>
              )) : <tr><td colSpan={4}>Secilen donem icin rapor verisi yok.</td></tr>}
            </tbody>
          </table>
        </section>
      )}

      {showComparison && (
        <section className="report-print-comparison">
          <h3>Donem Karsilastirmasi</h3>
          <p>{comparisonMode}</p>
          <table>
            <thead>
              <tr>
                <th scope="col">Ozet</th>
                <th scope="col">{leftReport?.periodLabel ?? "Donem 1"}<span>{leftCategoryName}</span></th>
                <th scope="col">{rightReport?.periodLabel ?? "Donem 2"}<span>{rightCategoryName}</span></th>
                <th scope="col">Fark (1 − 2)</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(({ key, label }) => (
                <tr key={key}>
                  <th scope="row">{label}</th>
                  <td>{formatCurrency(leftReport?.totals[key] ?? 0)}</td>
                  <td>{formatCurrency(rightReport?.totals[key] ?? 0)}</td>
                  <td>{formatCurrency((leftReport?.totals[key] ?? 0) - (rightReport?.totals[key] ?? 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </article>
  );
}
