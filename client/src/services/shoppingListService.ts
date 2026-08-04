import { api } from './api';
import type {
  CreateShoppingListItemData,
  ShoppingList,
  ShoppingListItem,
  UpdateShoppingListItemData,
} from '../types/shoppingList';

export async function getShoppingList(): Promise<ShoppingList> {
  const response = await api.get<ShoppingList>('/shopping-list');
  return response.data;
}

export async function createShoppingListItem(
  data: CreateShoppingListItemData,
): Promise<ShoppingListItem> {
  const response = await api.post<ShoppingListItem>(
    '/shopping-list/items',
    data,
  );

  return response.data;
}

export async function updateShoppingListItem(
  id: string,
  data: UpdateShoppingListItemData,
): Promise<ShoppingListItem> {
  const response = await api.patch<ShoppingListItem>(
    `/shopping-list/items/${id}`,
    data,
  );

  return response.data;
}

export async function deleteShoppingListItem(id: string): Promise<void> {
  await api.delete(`/shopping-list/items/${id}`);
}

export async function generateShoppingListFromMealPlan(): Promise<ShoppingList> {
  const response = await api.post<ShoppingList>(
    '/shopping-list/generate-from-meal-plan',
  );

  return response.data;
}