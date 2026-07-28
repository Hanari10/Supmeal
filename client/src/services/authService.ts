import { api } from './api';
import type { LoginResponse, User } from '../types/auth';

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function register(data: RegisterData) {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
}

export async function login(data: LoginData) {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
}

export async function getProfile() {
  const response = await api.get<User>('/auth/profile');
  return response.data;
}