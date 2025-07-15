-- CreateTable
CREATE TABLE "ClientNote" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "nutritionistId" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientNote" ADD CONSTRAINT "ClientNote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientNote" ADD CONSTRAINT "ClientNote_nutritionistId_fkey" FOREIGN KEY ("nutritionistId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
