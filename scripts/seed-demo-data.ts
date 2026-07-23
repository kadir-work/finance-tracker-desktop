import path from "path";
import { PrismaClient } from "../generated/prisma-client";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${path.join(process.cwd(), "prisma", "finance-tracker.db")}`;
}

const prisma = new PrismaClient();

const extraCategories = [
  { name: "Temizlik", description: "Temizlik ve sarf giderleri" },
  { name: "Lojistik", description: "Nakliye ve ulasim giderleri" },
  { name: "Bakim", description: "Bakim, onarim ve servis giderleri" },
  { name: "Misafir", description: "Misafir agirlamak ve ikram giderleri" },
];

const demoTransactions: Array<[string, string, string, number, "income" | "expense", string]> = [
  ["2026-01-03", "Aylik yonetici kasasi devir", "Mudur", 18000, "income", "Diğer"],
  ["2026-01-05", "Mutfak stok yenileme", "Ayse", 2450, "expense", "Mutfak"],
  ["2026-01-08", "Fotokopi makinesi servis odemesi", "Burak", 1850, "expense", "Teknik"],
  ["2026-01-10", "Dis saha ulasim avansi iadesi", "Okan", 900, "income", "Lojistik"],
  ["2026-01-14", "Temizlik malzemesi alimi", "Zehra", 1320, "expense", "Temizlik"],
  ["2026-01-22", "Personel yemek destegi", "Merve", 1650, "expense", "Misafir"],
  ["2026-01-28", "Acil teknik kasa takviyesi", "Mudur", 6000, "income", "Teknik"],

  ["2026-02-02", "Subat yonetici kasasi devir", "Mudur", 22000, "income", "Diğer"],
  ["2026-02-04", "Kahve, cay ve ofis sarf alimi", "Ayse", 1780, "expense", "Mutfak"],
  ["2026-02-09", "Internet cihaz yenileme", "Burak", 4100, "expense", "Teknik"],
  ["2026-02-11", "Arac yakit iadesi", "Okan", 1250, "income", "Lojistik"],
  ["2026-02-15", "Misafir toplantisi ikram gideri", "Merve", 940, "expense", "Misafir"],
  ["2026-02-19", "Klima bakim odemesi", "Burak", 2650, "expense", "Bakim"],
  ["2026-02-26", "Gecici personel destek odemesi", "Mudur", 3200, "expense", "Maaşlar"],

  ["2026-03-01", "Mart yonetici kasasi devir", "Mudur", 26000, "income", "Diğer"],
  ["2026-03-03", "Toplanti salonu ikram alimi", "Merve", 1180, "expense", "Misafir"],
  ["2026-03-07", "Laptop adaptor ve kablo alimi", "Burak", 2950, "expense", "Teknik"],
  ["2026-03-12", "Kargo bedeli tahsil iadesi", "Okan", 640, "income", "Lojistik"],
  ["2026-03-16", "Toplu temizlik urunleri siparisi", "Zehra", 2140, "expense", "Temizlik"],
  ["2026-03-21", "Kapi kilit bakim odemesi", "Burak", 1730, "expense", "Bakim"],
  ["2026-03-28", "Kasa ustu gelir aktarimi", "Mudur", 8500, "income", "Diğer"],

  ["2026-04-01", "Nisan yonetici kasasi devir", "Mudur", 28000, "income", "Diğer"],
  ["2026-04-04", "Gunluk mutfak eksik listesi", "Ayse", 960, "expense", "Mutfak"],
  ["2026-04-06", "Yazici toner ve kagit alimi", "Burak", 2380, "expense", "Teknik"],
  ["2026-04-10", "Sehir ici teslimat iadesi", "Okan", 780, "income", "Lojistik"],
  ["2026-04-14", "Cam temizligi ve sarf gideri", "Zehra", 1490, "expense", "Temizlik"],
  ["2026-04-18", "Misafir kahvalti gideri", "Merve", 870, "expense", "Misafir"],
  ["2026-04-22", "Acil elektrik onarimi", "Burak", 3550, "expense", "Bakim"],
  ["2026-04-25", "Yoneticiden ek kasa destegi", "Mudur", 12000, "income", "Diğer"],

  ["2026-04-26", "Hafta sonu personel destek odemesi", "Mudur", 2100, "expense", "Maaşlar"],
  ["2026-04-27", "Mutfak buzdolabi tamir parcasi", "Burak", 1280, "expense", "Teknik"],
  ["2026-04-27", "Saha ulasim avans kapama", "Okan", 1450, "income", "Lojistik"],
];

async function main() {
  await prisma.appSetting.upsert({
    where: { key: "workspaceName" },
    update: { value: "Yonetici Kasa Paneli" },
    create: { key: "workspaceName", value: "Yonetici Kasa Paneli" },
  });

  await prisma.appSetting.upsert({
    where: { key: "defaultCurrency" },
    update: { value: "TRY" },
    create: { key: "defaultCurrency", value: "TRY" },
  });

  for (const category of extraCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {
        description: category.description,
        isActive: true,
      },
      create: {
        ...category,
        isDefault: false,
        isActive: true,
      },
    });
  }

  await prisma.transaction.deleteMany({
    where: {
      notes: "demo-screenshot-data",
    },
  });

  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((item) => [item.name, item.id]));

  for (const [date, description, person, amount, type, categoryName] of demoTransactions) {
    const categoryId = categoryMap.get(categoryName);

    if (!categoryId) {
      throw new Error(`Category not found: ${categoryName}`);
    }

    await prisma.transaction.create({
      data: {
        date: new Date(date),
        description,
        person,
        amount,
        currencyCode: "TRY",
        type,
        notes: "demo-screenshot-data",
        categoryId,
      },
    });
  }

  const total = await prisma.transaction.count({
    where: { notes: "demo-screenshot-data" },
  });

  console.log(`Demo data inserted: ${total} transactions`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
