export interface Recipe {
  id: string;
  name: string;
  description?: string;
  instructions: string;
  preparationTime?: number;
  cookingTime?: number;
  servings?: number;
  difficulty?: string;
  imageUrl?: string;
}

export interface CreateRecipeData {
  name: string;
  description?: string;
  instructions: string;
  preparationTime?: number;
  cookingTime?: number;
  servings?: number;
  difficulty?: string;
  imageUrl?: string;
}