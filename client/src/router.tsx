import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import IngredientsPage from './pages/IngredientsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RecipesPage from './pages/RecipesPage';
import RegisterPage from './pages/RegisterPage';
import ShoppingListPage from './pages/ShoppingListPage';
import CreateRecipePage from './pages/CreateRecipePage';

export const router = createBrowserRouter([
  {
    path: '/connexion',
    element: <LoginPage />,
  },
  {
    path: '/inscription',
    element: <RegisterPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/recettes/nouvelle',
        element: <CreateRecipePage />,
      },
      {
        path: '/recettes',
        element: <RecipesPage />,
      },
      {
        path: '/liste-de-courses',
        element: <ShoppingListPage />,
      },
      {
        path: '/ingredients',
        element: <IngredientsPage />,
      },
      {
        path: '/profil',
        element: <ProfilePage />,
      },
    ],
  },
]);