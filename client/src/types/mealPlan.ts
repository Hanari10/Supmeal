import type { Recipe } from './recipe';

export type WeekDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export interface MealPlan {
  id: string;
  userId: string;
  recipeId: string;
  day: WeekDay;
  mealType: MealType;
  servings?: number | null;
  recipe: Recipe;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealPlanData {
  recipeId: string;
  day: WeekDay;
  mealType: MealType;
  servings?: number;
}

export type UpdateMealPlanData = Partial<CreateMealPlanData>;