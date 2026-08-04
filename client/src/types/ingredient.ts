export interface Ingredient {
  id: string;
  name: string;
  category?: string | null;
  defaultMeasurementUnit?: string | null;
}

export interface CreateIngredientData {
  name: string;
  category?: string;
  defaultMeasurementUnit?: string;
}

export interface UpdateIngredientData {
  name?: string;
  category?: string;
  defaultMeasurementUnit?: string;
}
