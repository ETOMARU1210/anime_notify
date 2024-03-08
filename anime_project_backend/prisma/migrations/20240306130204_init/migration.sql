-- CreateTable
CREATE TABLE "Anime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "releasedOn" DATETIME NOT NULL,
    "officialSiteUrl" TEXT,
    "wikipediaUrl" TEXT
);

-- CreateTable
CREATE TABLE "AnimeSubscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "animeId" INTEGER NOT NULL,
    "notificationEnabled" BOOLEAN NOT NULL,
    "notificationTime" DATETIME NOT NULL,
    CONSTRAINT "AnimeSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AnimeSubscription_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
