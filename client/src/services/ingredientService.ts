import { api } from './api';
import type {
  CreateIngredientData,
  Ingredient,
  UpdateIngredientData,
} from '../types/ingredient';

export async function getIngredients(): Promise<Ingredient[]> {
  const response = await api.get<Ingredient[]>('/ingredients');
  return response.data;
}

export async function createIngredient(
  data: CreateIngredientData,
): Promise<Ingredient> {
  const response = await api.post<Ingredient>('/ingredients', data);
  return response.data;
}

export async function updateIngredient(
  id: string,
  data: UpdateIngredientData,
): Promise<Ingredient> {
  const response = await api.patch<Ingredient>(`/ingredients/${id}`, data);
  return response.data;
}

export async function deleteIngredient(id: string): Promise<void> {
  await api.delete(`/ingredients/${id}`);
}