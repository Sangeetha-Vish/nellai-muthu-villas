/*
  Warnings:

  - Added the required column `publicOrderId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "simpleId" TEXT NOT NULL,
    "publicOrderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "orderType" TEXT NOT NULL DEFAULT 'PRE_ORDER',
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
    "pickupOtpHash" TEXT,
    "otpVerified" BOOLEAN NOT NULL DEFAULT false,
    "totalAmount" INTEGER NOT NULL,
    "pickupTime" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("branchId", "createdAt", "id", "orderType", "pickupTime", "simpleId", "status", "totalAmount", "updatedAt", "userId") SELECT "branchId", "createdAt", "id", "orderType", "pickupTime", "simpleId", "status", "totalAmount", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_simpleId_key" ON "Order"("simpleId");
CREATE UNIQUE INDEX "Order_publicOrderId_key" ON "Order"("publicOrderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
