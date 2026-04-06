-- DropIndex
DROP INDEX "FinancialRecord_category_idx";

-- DropIndex
DROP INDEX "FinancialRecord_type_idx";

-- CreateIndex
CREATE INDEX "FinancialRecord_type_category_date_idx" ON "FinancialRecord"("type", "category", "date");

-- CreateIndex
CREATE INDEX "FinancialRecord_category_type_idx" ON "FinancialRecord"("category", "type");
