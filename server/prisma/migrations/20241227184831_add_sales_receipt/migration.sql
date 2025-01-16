/*
  Warnings:

  - Added the required column `receiptId` to the `Sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sales" ADD COLUMN     "receiptId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SalesReceipt" (
    "receiptId" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL,
    "remark" TEXT,

    CONSTRAINT "SalesReceipt_pkey" PRIMARY KEY ("receiptId")
);

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "SalesReceipt"("receiptId") ON DELETE RESTRICT ON UPDATE CASCADE;
