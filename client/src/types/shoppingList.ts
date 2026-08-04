import type { Ingredient } from './ingredient';

export interface ShoppingListItem {
  id: string;
  ingredientId: string;
  quantity: number;
  unit?: string | null;
  ingredient: Ingredient;
  createdAt?: string;
}

export interface ShoppingList {
  id?: string;
  userId?: string;
  items: ShoppingListItem[];
}

export interface CreateShoppingListItemData {
  ingredientId: string;
  quantity: number;
  unit?: string;
}

export interface UpdateShoppingListItemData {
  ingredientId?: string;
  quantity?: number;
  unit?: string;
}