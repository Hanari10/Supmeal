import type { Ingredient } from './ingredient';

export interface RecipeIngredient {
  recipeId: string;
  ingredientId: string;
  quantity: number;
  unit?: string | null;
  order: number;
  ingredient: Ingredient;
}

export interface CreateRecipeIngredientData {
  ingredientId: string;
  quantity: number;
  unit?: string;
  order?: number;
}

export interface UpdateRecipeIngredientData {
  quantity?: number;
  unit?: string;
  order?: number;
}