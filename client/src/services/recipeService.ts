import { api } from './api';
import type { CreateRecipeData, Recipe } from '../types/recipe';

export async function getRecipes(): Promise<Recipe[]> {
  const response = await api.get<Recipe[]>('/recipes');
  return response.data;
}

export async function createRecipe(
  data: CreateRecipeData,
): Promise<Recipe> {
  const response = await api.post<Recipe>('/recipes', data);
  return response.data;
}