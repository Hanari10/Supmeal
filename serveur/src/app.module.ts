import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipesModule } from './recipes/recipes.module';
import { RecipeIngredientsModule } from './recipe-ingredients/recipe-ingredients.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { CookbooksModule } from './cookbooks/cookbooks.module';
import { TagsModule } from './tags/tags.module';
import { FavoritesModule } from './favorites/favorites.module';
import { MealPlansModule } from './meal-plans/meal-plans.module';
import { DataTransferModule } from './data-transfer/data-transfer.module';
import { RecipeCommentsModule } from './recipe-comments/recipe-comments.module';

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
    ShoppingListModule,
    CookbooksModule,
    TagsModule,
    FavoritesModule,
    MealPlansModule,
    DataTransferModule,
    RecipeCommentsModule,
  ],
})
export class AppModule {}
