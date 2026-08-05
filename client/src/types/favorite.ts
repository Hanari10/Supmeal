import type { Recipe } from './recipe';

export interface Favorite {
  userId: string;
  recipeId: string;
  createdAt: string;
  recipe: Recipe;
}