import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { CookbookMessagesModule } from './cookbook-messages/cookbook-messages.module';
import { CookbooksModule } from './cookbooks/cookbooks.module';
import { DataTransferModule } from './data-transfer/data-transfer.module';
import { PrismaModule } from './database/prisma.module';
import { FavoritesModule } from './favorites/favorites.module';
import { HealthModule } from './health/health.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { MealPlansModule } from './meal-plans/meal-plans.module';
import { RecipeCommentsModule } from './recipe-comments/recipe-comments.module';
import { RecipeIngredientsModule } from './recipe-ingredients/recipe-ingredients.module';
import { RecipesModule } from './recipes/recipes.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    IngredientsModule,
    RecipesModule,
    RecipeIngredientsModule,
    RecipeCommentsModule,
    ShoppingListModule,
    CookbooksModule,
    CookbookMessagesModule,
    TagsModule,
    FavoritesModule,
    MealPlansModule,
    DataTransferModule,
  ],
})
export class AppModule {}
