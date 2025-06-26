-- CreateTable
CREATE TABLE "User" (
    "u_id" SERIAL NOT NULL,
    "u_role" INTEGER NOT NULL,
    "u_firstname" TEXT NOT NULL,
    "u_lastname" TEXT NOT NULL,
    "u_email" TEXT NOT NULL,
    "u_password" TEXT NOT NULL,
    "u_status" INTEGER NOT NULL,
    "u_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "u_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("u_id")
);

-- CreateTable
CREATE TABLE "App" (
    "app_id" SERIAL NOT NULL,
    "app_name" TEXT NOT NULL,
    "app_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "app_updated_at" TIMESTAMP(3) NOT NULL,
    "app_status" INTEGER NOT NULL,

    CONSTRAINT "App_pkey" PRIMARY KEY ("app_id")
);

-- CreateTable
CREATE TABLE "UserApp" (
    "ua_id" SERIAL NOT NULL,
    "ua_u_id" INTEGER NOT NULL,
    "ua_app_id" INTEGER NOT NULL,
    "ua_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ua_updated_at" TIMESTAMP(3) NOT NULL,
    "ua_status" INTEGER NOT NULL,

    CONSTRAINT "UserApp_pkey" PRIMARY KEY ("ua_id")
);

-- CreateTable
CREATE TABLE "AppStats" (
    "as_id" SERIAL NOT NULL,
    "as_date" TIMESTAMP(3) NOT NULL,
    "as_ua_id" INTEGER NOT NULL,
    "as_ai_id" INTEGER NOT NULL,
    "as_count" INTEGER NOT NULL,
    "as_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "as_updated_at" TIMESTAMP(3) NOT NULL,
    "as_status" INTEGER NOT NULL,

    CONSTRAINT "AppStats_pkey" PRIMARY KEY ("as_id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "ur_id" SERIAL NOT NULL,
    "ur_role" INTEGER NOT NULL,
    "ur_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ur_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("ur_id")
);

-- CreateTable
CREATE TABLE "AppApi" (
    "ai_id" SERIAL NOT NULL,
    "ai_name" TEXT NOT NULL,
    "ai_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ai_updated_at" TIMESTAMP(3),
    "ai_status" INTEGER NOT NULL,

    CONSTRAINT "AppApi_pkey" PRIMARY KEY ("ai_id")
);

-- CreateTable
CREATE TABLE "_AppToAppStats" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AppToAppStats_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "App_app_name_key" ON "App"("app_name");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_ur_role_key" ON "UserRole"("ur_role");

-- CreateIndex
CREATE INDEX "_AppToAppStats_B_index" ON "_AppToAppStats"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_u_role_fkey" FOREIGN KEY ("u_role") REFERENCES "UserRole"("ur_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApp" ADD CONSTRAINT "UserApp_ua_u_id_fkey" FOREIGN KEY ("ua_u_id") REFERENCES "User"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApp" ADD CONSTRAINT "UserApp_ua_app_id_fkey" FOREIGN KEY ("ua_app_id") REFERENCES "App"("app_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppStats" ADD CONSTRAINT "AppStats_as_ua_id_fkey" FOREIGN KEY ("as_ua_id") REFERENCES "UserApp"("ua_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppStats" ADD CONSTRAINT "AppStats_as_ai_id_fkey" FOREIGN KEY ("as_ai_id") REFERENCES "AppApi"("ai_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppToAppStats" ADD CONSTRAINT "_AppToAppStats_A_fkey" FOREIGN KEY ("A") REFERENCES "App"("app_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppToAppStats" ADD CONSTRAINT "_AppToAppStats_B_fkey" FOREIGN KEY ("B") REFERENCES "AppStats"("as_id") ON DELETE CASCADE ON UPDATE CASCADE;
