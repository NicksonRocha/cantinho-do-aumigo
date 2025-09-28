/*
  Warnings:

  - The primary key for the `Pet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedAt` on the `Pet` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Pet` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Made the column `authorId` on table `Pet` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "ageMonths" INTEGER NOT NULL,
    "weightKg" REAL,
    "temperament" TEXT,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "vaccinated" BOOLEAN DEFAULT false,
    "neutered" BOOLEAN DEFAULT false,
    "dewormed" BOOLEAN DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pet" ("ageMonths", "authorId", "breed", "color", "createdAt", "description", "dewormed", "id", "imageUrl", "name", "neutered", "sex", "size", "temperament", "vaccinated") SELECT "ageMonths", "authorId", "breed", "color", "createdAt", "description", "dewormed", "id", "imageUrl", "name", "neutered", "sex", "size", "temperament", "vaccinated" FROM "Pet";
DROP TABLE "Pet";
ALTER TABLE "new_Pet" RENAME TO "Pet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
