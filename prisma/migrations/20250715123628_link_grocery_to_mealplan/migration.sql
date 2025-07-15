/*
  Warnings:

  - A unique constraint covering the columns `[groceryId]` on the table `MealPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GroceryList" ADD COLUMN     "mealPlanId" INTEGER;

-- AlterTable
ALTER TABLE "MealPlan" ADD COLUMN     "groceryId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "MealPlan_groceryId_key" ON "MealPlan"("groceryId");

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_groceryId_fkey" FOREIGN KEY ("groceryId") REFERENCES "GroceryList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
