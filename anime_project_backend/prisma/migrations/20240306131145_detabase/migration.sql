/*
  Warnings:

  - You are about to drop the column `officialSiteUrl` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `releasedOn` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `wikipediaUrl` on the `Anime` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Anime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL
);
INSERT INTO "new_Anime" ("id", "title") SELECT "id", "title" FROM "Anime";
DROP TABLE "Anime";
ALTER TABLE "new_Anime" RENAME TO "Anime";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
