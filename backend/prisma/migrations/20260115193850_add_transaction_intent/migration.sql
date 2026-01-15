-- CreateEnum
CREATE TYPE "IntentStatus" AS ENUM ('PENDING', 'APPROVED', 'BLOCKED', 'CONFIRMED', 'EXECUTED', 'FAILED');

-- CreateTable
CREATE TABLE "TransactionIntent" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "IntentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "exceutedAt" TIMESTAMP(3),
    "decisionReason" TEXT,
    "riskScore" INTEGER DEFAULT 0,

    CONSTRAINT "TransactionIntent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransactionIntent_senderId_idx" ON "TransactionIntent"("senderId");

-- CreateIndex
CREATE INDEX "TransactionIntent_receiverId_idx" ON "TransactionIntent"("receiverId");

-- AddForeignKey
ALTER TABLE "TransactionIntent" ADD CONSTRAINT "TransactionIntent_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionIntent" ADD CONSTRAINT "TransactionIntent_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
