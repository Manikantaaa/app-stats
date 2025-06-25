-- CreateTable
CREATE TABLE "User" (
    "u_id" SERIAL NOT NULL,
    "u_firstname" TEXT NOT NULL,
    "u_lastname" TEXT NOT NULL,
    "u_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "u_updated_at" TIMESTAMP(3) NOT NULL,
    "u_status" INTEGER NOT NULL,

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
    "as_app_id" INTEGER NOT NULL,
    "as_count" INTEGER NOT NULL,
    "as_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "as_updated_at" TIMESTAMP(3) NOT NULL,
    "as_status" INTEGER NOT NULL,

    CONSTRAINT "AppStats_pkey" PRIMARY KEY ("as_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "App_app_name_key" ON "App"("app_name");

-- AddForeignKey
ALTER TABLE "UserApp" ADD CONSTRAINT "UserApp_ua_u_id_fkey" FOREIGN KEY ("ua_u_id") REFERENCES "User"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApp" ADD CONSTRAINT "UserApp_ua_app_id_fkey" FOREIGN KEY ("ua_app_id") REFERENCES "App"("app_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppStats" ADD CONSTRAINT "AppStats_as_app_id_fkey" FOREIGN KEY ("as_app_id") REFERENCES "App"("app_id") ON DELETE RESTRICT ON UPDATE CASCADE;
