-- AlterTable
ALTER TABLE "User" ADD COLUMN     "u_role" INTEGER NOT NULL DEFAULT 2;

-- CreateTable
CREATE TABLE "UserRole" (
    "ur_id" SERIAL NOT NULL,
    "ur_role" INTEGER NOT NULL,
    "ur_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ur_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("ur_id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_u_role_fkey" FOREIGN KEY ("u_role") REFERENCES "UserRole"("ur_id") ON DELETE RESTRICT ON UPDATE CASCADE;
