-- CreateTable
CREATE TABLE "CookbookMessage" (
    "id" TEXT NOT NULL,
    "cookbookId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CookbookMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CookbookMessage_cookbookId_createdAt_idx" ON "CookbookMessage"("cookbookId", "createdAt");

-- CreateIndex
CREATE INDEX "CookbookMessage_userId_idx" ON "CookbookMessage"("userId");

-- AddForeignKey
ALTER TABLE "CookbookMessage" ADD CONSTRAINT "CookbookMessage_cookbookId_fkey" FOREIGN KEY ("cookbookId") REFERENCES "Cookbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CookbookMessage" ADD CONSTRAINT "CookbookMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
