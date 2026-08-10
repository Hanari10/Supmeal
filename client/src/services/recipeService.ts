import { api } from './api';
import type {
  CreateRecipeData,
  Recipe,
  UpdateRecipeData,
} from '../types/recipe';

export async function getRecipes(): Promise<Recipe[]> {
  const response = await api.get<Recipe[]>('/recipes');
  return response.data;
}

export async function getRecipe(id: string): Promise<Recipe> {
  const response = await api.get<Recipe>(`/recipes/${id}`);
  return response.data;
}

export async function createRecipe(
  data: CreateRecipeData,
): Promise<Recipe> {
  const response = await api.post<Recipe>('/recipes', data);
  return response.data;
}

export async function updateRecipe(
  id: string,
  data: UpdateRecipeData,
): Promise<Recipe> {
  const response = await api.patch<Recipe>(`/recipes/${id}`, data);
  return response.data;
}

export async function deleteRecipe(id: string): Promise<void> {
  await api.delete(`/recipes/${id}`);
}

export interface UploadRecipeImageResponse {
  imageUrl: string;
}

export async function uploadRecipeImage(
  file: File,
): Promise<UploadRecipeImageResponse> {
  const formData = new FormData();

  formData.append('file', file);

  const response = await api.post<UploadRecipeImageResponse>(
    '/recipes/upload-image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
}