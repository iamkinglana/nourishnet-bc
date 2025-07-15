/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Meal` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Meal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "createdBy",
ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "ingredients" TEXT[],
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "calories" DROP NOT NULL,
ALTER COLUMN "calories" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
