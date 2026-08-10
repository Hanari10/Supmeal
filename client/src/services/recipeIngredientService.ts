import { api } from './api';

import type {
  CreateRecipeIngredientData,
  RecipeIngredient,
  UpdateRecipeIngredientData,
} from '../types/recipeIngredient';

export async function getRecipeIngredients(
  recipeId: string,
): Promise<RecipeIngredient[]> {
  const response = await api.get<RecipeIngredient[]>(
    `/recipes/${recipeId}/ingredients`,
  );

  return response.data;
}

export async function addRecipeIngredient(
  recipeId: string,
  data: CreateRecipeIngredientData,
): Promise<RecipeIngredient> {
  const response = await api.post<RecipeIngredient>(
    `/recipes/${recipeId}/ingredients`,
    data,
  );

  return response.data;
}

export async function updateRecipeIngredient(
  recipeId: string,
  ingredientId: string,
  data: UpdateRecipeIngredientData,
): Promise<RecipeIngredient> {
  const response = await api.patch<RecipeIngredient>(
    `/recipes/${recipeId}/ingredients/${ingredientId}`,
    data,
  );

  return response.data;
}

export async function deleteRecipeIngredient(
  recipeId: string,
  ingredientId: string,
): Promise<void> {
  await api.delete(
    `/recipes/${recipeId}/ingredients/${ingredientId}`,
  );
}