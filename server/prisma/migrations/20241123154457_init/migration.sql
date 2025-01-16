/*
  Warnings:

  - The primary key for the `Expenses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `amount` on the `Expenses` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Expenses` table. All the data in the column will be lost.
  - You are about to drop the column `expenseId` on the `Expenses` table. All the data in the column will be lost.
  - The primary key for the `Products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `rating` on the `Products` table. All the data in the column will be lost.
  - The `productId` column on the `Products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Sales` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `saleId` column on the `Sales` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ExpenseByCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExpenseSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Purchases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SalesSummary` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cost` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expenseCategoryId` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectionId` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `productId` on the `Sales` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ExpenseByCategory" DROP CONSTRAINT "ExpenseByCategory_expenseSummaryId_fkey";

-- DropForeignKey
ALTER TABLE "Purchases" DROP CONSTRAINT "Purchases_productId_fkey";

-- DropForeignKey
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_productId_fkey";

-- AlterTable
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_pkey",
DROP COLUMN "amount",
DROP COLUMN "category",
DROP COLUMN "expenseId",
ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "expenseCategoryId" INTEGER NOT NULL,
ADD COLUMN     "expensesId" SERIAL NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "remark" TEXT,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Expenses_pkey" PRIMARY KEY ("expensesId");

-- AlterTable
ALTER TABLE "Products" DROP CONSTRAINT "Products_pkey",
DROP COLUMN "rating",
ADD COLUMN     "collectionId" INTEGER NOT NULL,
ADD COLUMN     "productImage" TEXT,
ADD COLUMN     "sku" TEXT NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" SERIAL NOT NULL,
ADD CONSTRAINT "Products_pkey" PRIMARY KEY ("productId");

-- AlterTable
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_pkey",
ADD COLUMN     "remark" TEXT,
DROP COLUMN "saleId",
ADD COLUMN     "saleId" SERIAL NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Sales_pkey" PRIMARY KEY ("saleId");

-- DropTable
DROP TABLE "ExpenseByCategory";

-- DropTable
DROP TABLE "ExpenseSummary";

-- DropTable
DROP TABLE "PurchaseSummary";

-- DropTable
DROP TABLE "Purchases";

-- DropTable
DROP TABLE "SalesSummary";

-- CreateTable
CREATE TABLE "Collections" (
    "collectionId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Collections_pkey" PRIMARY KEY ("collectionId")
);

-- CreateTable
CREATE TABLE "ExpenseCategory" (
    "expenseCategoryId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ExpenseCategory_pkey" PRIMARY KEY ("expenseCategoryId")
);

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collections"("collectionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_expenseCategoryId_fkey" FOREIGN KEY ("expenseCategoryId") REFERENCES "ExpenseCategory"("expenseCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
