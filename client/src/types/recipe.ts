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

  recipeIngredients?: {
    ingredientId: string;
    quantity: number;
    unit?: string | null;

    ingredient: {
      name: string;
    };
  }[];
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

export type UpdateRecipeData = Omit<
  Partial<CreateRecipeData>,
  'imageUrl'
> & {
  imageUrl?: string | null;
};
