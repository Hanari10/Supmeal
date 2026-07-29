-- CreateTable
CREATE TABLE "Favorite" (
    "userId" UUID NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("userId","recipeId")
);

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
