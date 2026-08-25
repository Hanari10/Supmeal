export interface CookbookMessageUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
}

export interface CookbookMessage {
  id: string;
  cookbookId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: CookbookMessageUser;
}