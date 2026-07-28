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
  ],
})
export class AppModule {}
