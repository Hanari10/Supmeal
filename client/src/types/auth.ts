export interface User {
  id: string;
  email: string;

  firstName?: string | null;
  lastName?: string | null;

  profileImage?: string | null;

  defaultServings: number;

  dietaryPreferences: string[];

  allergies: string[];

  preferredCuisines: string[];

  createdAt: string;

  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;

  user: User;
}