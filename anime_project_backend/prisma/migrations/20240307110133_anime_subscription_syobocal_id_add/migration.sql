/*
  Warnings:

  - Added the required column `syobocal_id` to the `AnimeSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnimeSubscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "syobocal_id" INTEGER NOT NULL,
    "notificationEnabled" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "AnimeSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AnimeSubscription" ("id", "notificationEnabled", "title", "userId") SELECT "id", "notificationEnabled", "title", "userId" FROM "AnimeSubscription";
DROP TABLE "AnimeSubscription";
ALTER TABLE "new_AnimeSubscription" RENAME TO "AnimeSubscription";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
