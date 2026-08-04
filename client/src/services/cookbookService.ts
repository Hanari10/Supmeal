import { api } from './api';
import type {
  AddCookbookMemberData,
  Cookbook,
  CookbookMember,
  CreateCookbookData,
  UpdateCookbookData,
} from '../types/cookbook';

export async function getCookbooks(): Promise<Cookbook[]> {
  const response = await api.get<Cookbook[]>('/cookbooks');
  return response.data;
}

export async function getCookbook(id: string): Promise<Cookbook> {
  const response = await api.get<Cookbook>(`/cookbooks/${id}`);
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
  const response = await api.patch<Cookbook>(`/cookbooks/${id}`, data);
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
  await api.delete(`/cookbooks/${cookbookId}/members/${memberId}`);
}