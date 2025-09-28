-- CreateTable
CREATE TABLE "PetImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "petId" INTEGER NOT NULL,
    "publicId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "PetImage_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PetImage_petId_idx" ON "PetImage"("petId");

-- CreateIndex
CREATE UNIQUE INDEX "PetImage_petId_position_key" ON "PetImage"("petId", "position");
