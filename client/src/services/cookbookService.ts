import { api } from './api';
import type {
  AddCookbookMemberData,
  AddCookbookRecipeData,
  Cookbook,
  CookbookMember,
  CreateCookbookData,
  UpdateCookbookData,
} from '../types/cookbook';
import type { Recipe } from '../types/recipe';

export async function getCookbooks(): Promise<Cookbook[]> {
  const response = await api.get<Cookbook[]>('/cookbooks');
  return response.data;
}

export async function getCookbook(id: string): Promise<Cookbook> {
  const response = await api.get<Cookbook>(`/cookbooks/${id}`);
  return response.data;
}

export async function searchCookbookRecipes(
  cookbookId: string,
  query: string,
): Promise<Recipe[]> {
  const response = await api.get<Recipe[]>(
    `/cookbooks/${cookbookId}/recipes/search`,
    {
      params: {
        query,
      },
    },
  );

  return response.data;
}

export async function createCookbook(
  data: CreateCookbookData,
): Promise<Cookbook> {
  const response = await api.post<Cookbook>('/cookbooks', data);
  return response.data;
}

export async function updateCookbook(
  id: string,
  data: UpdateCookbookData,
): Promise<Cookbook> {
  const response = await api.patch<Cookbook>(
    `/cookbooks/${id}`,
    data,
  );

  return response.data;
}

export async function deleteCookbook(id: string): Promise<void> {
  await api.delete(`/cookbooks/${id}`);
}

export async function addCookbookMember(
  cookbookId: string,
  data: AddCookbookMemberData,
): Promise<CookbookMember> {
  const response = await api.post<CookbookMember>(
    `/cookbooks/${cookbookId}/members`,
    data,
  );

  return response.data;
}

export async function removeCookbookMember(
  cookbookId: string,
  memberId: string,
): Promise<void> {
  await api.delete(
    `/cookbooks/${cookbookId}/members/${memberId}`,
  );
}

export async function addCookbookRecipe(
  cookbookId: string,
  data: AddCookbookRecipeData,
): Promise<Cookbook> {
  const response = await api.post<Cookbook>(
    `/cookbooks/${cookbookId}/recipes`,
    data,
  );

  return response.data;
}

export async function removeCookbookRecipe(
  cookbookId: string,
  recipeId: string,
): Promise<Cookbook> {
  const response = await api.delete<Cookbook>(
    `/cookbooks/${cookbookId}/recipes/${recipeId}`,
  );

  return response.data;
}