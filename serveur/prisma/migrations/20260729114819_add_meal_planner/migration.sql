/*
  Warnings:

  - The primary key for the `MealPlan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `MealPlan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,day,mealType]` on the table `MealPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `day` to the `MealPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MealPlan` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `MealPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `mealType` to the `MealPlan` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `MealPlan` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER');

-- DropForeignKey
ALTER TABLE "MealPlan" DROP CONSTRAINT "MealPlan_userId_fkey";

-- AlterTable
ALTER TABLE "MealPlan" DROP CONSTRAINT "MealPlan_pkey",
DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "day" "WeekDay" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "mealType",
ADD COLUMN     "mealType" "MealType" NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
ADD CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "MealPlan_userId_day_mealType_key" ON "MealPlan"("userId", "day", "mealType");

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
