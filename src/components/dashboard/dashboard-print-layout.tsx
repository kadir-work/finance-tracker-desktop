"use client";

import { Cell, Pie, PieChart } from "recharts";
import { formatCurrency, formatDate } from "@/lib/format";
import type { DashboardData } from "@/lib/types";

const colors = ["#264653", "#2a9d8f", "#f4a261", "#e76f51", "#8ab17d"];

export function DashboardPrintLayout({ data, month, scope }: {
  data: DashboardData | null;
  month: string;
  scope: "all" | "totals" | "categories" | "recent";
}) {
  return (
    <article className="print-only report-print">
      <header className="report-print-title"><h2>Genel Panel</h2><p>{data?.monthLabel ?? month}</p></header>
      {(scope === "all" || scope === "totals") && (
        <section className="report-print-summary">
          <h3>Genel kasa ozeti</h3>
          <div className="report-print-totals">
            <div><p>Kasada mevcut bakiye</p><strong>{formatCurrency(data?.overallTotals.net ?? 0)}</strong></div>
            <div><p>Toplam giren</p><strong>{formatCurrency(data?.overallTotals.income ?? 0)}</strong></div>
            <div><p>Toplam cikan</p><strong>{formatCurrency(data?.overallTotals.expense ?? 0)}</strong></div>
          </div>
          <h3>{data?.monthLabel ?? month} ozeti</h3>
          <div className="report-print-totals">
            <div><p>Gelir</p><strong>{formatCurrency(data?.totals.income ?? 0)}</strong></div>
            <div><p>Gider</p><strong>{formatCurrency(data?.totals.expense ?? 0)}</strong></div>
            <div><p>Net sonuc</p><strong>{formatCurrency(data?.totals.net ?? 0)}</strong></div>
          </div>
        </section>
      )}
      {(scope === "all" || scope === "categories") && (
        <section>
          <h3>Kategoriye gore gider dagilimi</h3>
          <div className={data && data.categoryDistribution.length <= 16 ? "report-print-distribution-compact" : ""}>
          {!!data?.categoryDistribution.length && (
            <div className="report-print-chart report-print-pie">
              <PieChart width={230} height={160}>
                <Pie data={data.categoryDistribution} dataKey="total" nameKey="category" innerRadius={40} outerRadius={70} isAnimationActive={false}>
                  {data.categoryDistribution.map((item, index) => <Cell key={item.category} fill={colors[index % colors.length]} />)}
                </Pie>
              </PieChart>
            </div>
          )}
          <table>
            <thead><tr><th scope="col">Kategori</th><th scope="col">Gider</th></tr></thead>
            <tbody>
              {data?.categoryDistribution.length ? data.categoryDistribution.map((item, index) => (
                <tr key={item.category}><th scope="row"><span className="report-print-key" style={{ backgroundColor: colors[index % colors.length] }} />{item.category}</th><td>{formatCurrency(item.total)}</td></tr>
              )) : <tr><td colSpan={2}>Secili donem icin gider verisi bulunmuyor.</td></tr>}
            </tbody>
          </table>
          </div>
        </section>
      )}
      {(scope === "all" || scope === "recent") && (
        <section>
          <h3>Son islemler</h3>
          <table className="print-transactions">
            <thead><tr><th scope="col">Tarih</th><th scope="col">Aciklama / Kisi</th><th scope="col">Kategori</th><th scope="col">Tur</th><th scope="col">Tutar</th></tr></thead>
            <tbody>
              {data?.recentTransactions.length ? data.recentTransactions.map(item => (
                <tr key={item.id}>
                  <td>{formatDate(item.date)}</td><td>{item.description}<span className="print-person">{item.person}</span></td>
                  <td>{item.category?.parent ? `${item.category.parent.name} > ` : ""}{item.category?.name}</td>
                  <td>{item.type === "income" ? "Gelir" : "Gider"}</td><td>{formatCurrency(item.amount, item.currencyCode ?? "TRY")}</td>
                </tr>
              )) : <tr><td colSpan={5}>Henuz islem kaydi yok.</td></tr>}
            </tbody>
          </table>
        </section>
      )}
    </article>
  );
}
