export type CookbookRole =
  | 'CREATOR'
  | 'EDITOR'
  | 'READER'
  | 'COMMENTER';

export interface CookbookUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface CookbookMember {
  id: string;
  userId: string;
  cookbookId: string;
  role: CookbookRole;
  user?: CookbookUser;
}

export interface CookbookRecipe {
  id: string;
  name: string;
  description?: string | null;
  userId?: string;
  cookbookId?: string | null;
}

export interface Cookbook {
  id: string;
  name: string;
  ownerId: string;
  owner?: CookbookUser;
  members: CookbookMember[];
  recipes: CookbookRecipe[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCookbookData {
  name: string;
}

export interface UpdateCookbookData {
  name?: string;
}

export interface AddCookbookMemberData {
  email: string;
  role: Exclude<CookbookRole, 'CREATOR'>;
}

export interface AddCookbookRecipeData {
  recipeId: string;
}
