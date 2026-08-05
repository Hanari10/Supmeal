import { api } from './api';
import type {
  CreateMealPlanData,
  MealPlan,
  UpdateMealPlanData,
} from '../types/mealPlan';

export async function getMealPlans(): Promise<MealPlan[]> {
  const response = await api.get<MealPlan[]>('/meal-plans');
  return response.data;
}

export async function createMealPlan(
  data: CreateMealPlanData,
): Promise<MealPlan> {
  const response = await api.post<MealPlan>('/meal-plans', data);
  return response.data;
}

export async function updateMealPlan(
  id: string,
  data: UpdateMealPlanData,
): Promise<MealPlan> {
  const response = await api.patch<MealPlan>(
    `/meal-plans/${id}`,
    data,
  );

  return response.data;
}

export async function deleteMealPlan(id: string): Promise<void> {
  await api.delete(`/meal-plans/${id}`);
}