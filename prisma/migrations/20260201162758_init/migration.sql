-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Branch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "timings" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "distance" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Branch" ("area", "createdAt", "distance", "id", "location", "name", "timings", "updatedAt") SELECT "area", "createdAt", "distance", "id", "location", "name", "timings", "updatedAt" FROM "Branch";
DROP TABLE "Branch";
ALTER TABLE "new_Branch" RENAME TO "Branch";
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "simpleId" TEXT NOT NULL,
    "publicOrderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
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
INSERT INTO "new_Order" ("branchId", "createdAt", "id", "orderType", "otpVerified", "paymentMethod", "pickupOtpHash", "pickupTime", "publicOrderId", "simpleId", "status", "totalAmount", "updatedAt", "userId") SELECT "branchId", "createdAt", "id", "orderType", "otpVerified", "paymentMethod", "pickupOtpHash", "pickupTime", "publicOrderId", "simpleId", "status", "totalAmount", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_simpleId_key" ON "Order"("simpleId");
CREATE UNIQUE INDEX "Order_publicOrderId_key" ON "Order"("publicOrderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
