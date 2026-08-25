export interface RecipeCommentUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profileImage?: string | null;
}

export interface RecipeComment {
  id: string;
  recipeId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: RecipeCommentUser;
}

export interface CreateRecipeCommentData {
  content: string;
}

export interface UpdateRecipeCommentData {
  content: string;
}