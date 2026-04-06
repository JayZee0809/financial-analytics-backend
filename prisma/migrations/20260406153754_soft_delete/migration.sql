-- DropIndex
DROP INDEX "FinancialRecord_type_category_date_idx";

-- AlterTable
ALTER TABLE "FinancialRecord" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "FinancialRecord_type_category_date_isDeleted_idx" ON "FinancialRecord"("type", "category", "date", "isDeleted");
