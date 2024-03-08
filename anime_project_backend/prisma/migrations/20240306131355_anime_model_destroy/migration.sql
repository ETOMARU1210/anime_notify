/*
  Warnings:

  - You are about to drop the `Anime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `animeId` on the `AnimeSubscription` table. All the data in the column will be lost.
  - Added the required column `title` to the `AnimeSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Anime";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnimeSubscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "notificationEnabled" BOOLEAN NOT NULL,
    "notificationTime" DATETIME NOT NULL,
    CONSTRAINT "AnimeSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AnimeSubscription" ("id", "notificationEnabled", "notificationTime", "userId") SELECT "id", "notificationEnabled", "notificationTime", "userId" FROM "AnimeSubscription";
DROP TABLE "AnimeSubscription";
ALTER TABLE "new_AnimeSubscription" RENAME TO "AnimeSubscription";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
