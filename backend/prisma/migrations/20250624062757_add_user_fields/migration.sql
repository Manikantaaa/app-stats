/*
  Warnings:

  - Added the required column `u_email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `u_password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "u_email" TEXT NOT NULL,
ADD COLUMN     "u_password" TEXT NOT NULL;
