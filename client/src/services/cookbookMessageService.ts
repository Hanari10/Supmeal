import { api } from './api';

import type { CookbookMessage } from '../types/cookbookMessage';

export interface CreateCookbookMessagePayload {
  content: string;
}

export interface UpdateCookbookMessagePayload {
  content: string;
}

export async function getCookbookMessages(
  cookbookId: string,
): Promise<CookbookMessage[]> {
  const response = await api.get<CookbookMessage[]>(
    `/cookbooks/${cookbookId}/messages`,
  );

  return response.data;
}

export async function createCookbookMessage(
  cookbookId: string,
  payload: CreateCookbookMessagePayload,
): Promise<CookbookMessage> {
  const response = await api.post<CookbookMessage>(
    `/cookbooks/${cookbookId}/messages`,
    payload,
  );

  return response.data;
}

export async function updateCookbookMessage(
  cookbookId: string,
  messageId: string,
  payload: UpdateCookbookMessagePayload,
): Promise<CookbookMessage> {
  const response = await api.patch<CookbookMessage>(
    `/cookbooks/${cookbookId}/messages/${messageId}`,
    payload,
  );

  return response.data;
}

export async function deleteCookbookMessage(
  cookbookId: string,
  messageId: string,
): Promise<void> {
  await api.delete(
    `/cookbooks/${cookbookId}/messages/${messageId}`,
  );
}