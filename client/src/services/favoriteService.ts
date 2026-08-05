import { api } from './api';
import type { Favorite } from '../types/favorite';

export async function getFavorites(): Promise<Favorite[]> {
  const response = await api.get<Favorite[]>('/favorites');
  return response.data;
}

export async function addFavorite(recipeId: string): Promise<Favorite> {
  const response = await api.post<Favorite>(`/favorites/${recipeId}`);
  return response.data;
}

export async function removeFavorite(recipeId: string): Promise<void> {
  await api.delete(`/favorites/${recipeId}`);
}