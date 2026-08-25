import { api } from './api';

import type {
  CreateRecipeCommentData,
  RecipeComment,
  UpdateRecipeCommentData,
} from '../types/recipeComment';

export async function getRecipeComments(
  recipeId: string,
): Promise<RecipeComment[]> {
  const response = await api.get<RecipeComment[]>(
    `/recipes/${recipeId}/comments`,
  );

  return response.data;
}

export async function createRecipeComment(
  recipeId: string,
  data: CreateRecipeCommentData,
): Promise<RecipeComment> {
  const response = await api.post<RecipeComment>(
    `/recipes/${recipeId}/comments`,
    data,
  );

  return response.data;
}

export async function updateRecipeComment(
  recipeId: string,
  commentId: string,
  data: UpdateRecipeCommentData,
): Promise<RecipeComment> {
  const response = await api.patch<RecipeComment>(
    `/recipes/${recipeId}/comments/${commentId}`,
    data,
  );

  return response.data;
}

export async function deleteRecipeComment(
  recipeId: string,
  commentId: string,
): Promise<void> {
  await api.delete(
    `/recipes/${recipeId}/comments/${commentId}`,
  );
}