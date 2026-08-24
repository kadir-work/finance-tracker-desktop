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
  ["2026-07-01", "Temmuz Yonetici Kasasi Devir", "Mudur", 40000, "income", "Diğer"],
  ["2026-07-04", "Temmuz Elektrik Faturasi", "Ayse", 3100, "expense", "Elektrik"],
  ["2026-07-06", "Temmuz Su Faturasi", "Ayse", 750, "expense", "Su"],
  ["2026-07-08", "Ofis Fiber Internet Siparisi", "Burak", 1200, "expense", "İnternet"],
  ["2026-07-12", "Mutfak & Kahve Stok Alimi", "Merve", 2400, "expense", "Mutfak"],
  ["2026-07-15", "Personel Temel Maas Odeleri", "Mudur", 16000, "expense", "Maaşlar"],
  ["2026-07-20", "Saha Yakit Destek Iadesi", "Okan", 1850, "income", "Lojistik"],
  ["2026-07-25", "Yazici Toner ve Kagit Siparisi", "Burak", 3200, "expense", "Teknik"],

  ["2026-08-01", "Agustos Yonetici Kasasi Devir", "Mudur", 45000, "income", "Diğer"],
  ["2026-08-03", "Agustos Elektrik Faturasi", "Ayse", 3450, "expense", "Elektrik"],
  ["2026-08-05", "Agustos Su Faturasi", "Ayse", 820, "expense", "Su"],
  ["2026-08-07", "Internet ve Fiber Aylik Odeme", "Burak", 1200, "expense", "İnternet"],
  ["2026-08-10", "Mutfak & Kahve Stok Yenileme", "Merve", 2850, "expense", "Mutfak"],
  ["2026-08-12", "Personel Maas Destek Odemesi", "Mudur", 18500, "expense", "Maaşlar"],
  ["2026-08-15", "Ofis Kirtasiye ve Toner Alimi", "Burak", 4100, "expense", "Teknik"],
  ["2026-08-18", "Saha Ulasim ve Yakit Iadesi", "Okan", 2300, "income", "Lojistik"],
  ["2026-08-20", "Dogalgaz Servis ve Bakim Odeme", "Burak", 2600, "expense", "Doğalgaz"],
  ["2026-08-22", "Musteri Agirlama ve Yemek", "Merve", 1750, "expense", "Misafir"],
  ["2026-08-24", "Teknik Servis Gelir Destegi", "Mudur", 6200, "income", "Teknik"],
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
