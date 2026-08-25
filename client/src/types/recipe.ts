export interface RecipeTag {
  tag: {
    id: string;
    name: string;
  };
}

export interface Recipe {
  id: string;
  name: string;
  description?: string | null;
  instructions: string;
  preparationTime?: number | null;
  cookingTime?: number | null;
  servings?: number | null;
  difficulty?: string | null;
  imageUrl?: string | null;
  sourceUrl?: string | null;
  cookbookId?: string | null;
  tags?: RecipeTag[];

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
  sourceUrl?: string;
  tags?: string[];
}

export type UpdateRecipeData = Omit<
  Partial<CreateRecipeData>,
  'imageUrl'
> & {
  imageUrl?: string | null;
};

export interface RecipeSearchFilters {
  query?: string;
  tag?: string;
  difficulty?: string;
  ingredient?: string;
  maxPreparationTime?: number;
  maxCookingTime?: number;
  cookbookId?: string;
  favorite?: boolean;
}