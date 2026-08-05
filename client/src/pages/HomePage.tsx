import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

import { getCookbooks } from '../services/cookbookService';
import { getIngredients } from '../services/ingredientService';
import { getRecipes } from '../services/recipeService';
import { getShoppingList } from '../services/shoppingListService';
import type { Recipe } from '../types/recipe';

interface DashboardStatistics {
  recipes: number;
  ingredients: number;
  cookbooks: number;
  shoppingItems: number;
}

function HomePage() {
  const navigate = useNavigate();

  const [statistics, setStatistics] = useState<DashboardStatistics>({
    recipes: 0,
    ingredients: 0,
    cookbooks: 0,
    shoppingItems: 0,
  });

  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');

        const [recipes, ingredients, cookbooks, shoppingList] =
          await Promise.all([
            getRecipes(),
            getIngredients(),
            getCookbooks(),
            getShoppingList(),
          ]);

        setStatistics({
          recipes: recipes.length,
          ingredients: ingredients.length,
          cookbooks: cookbooks.length,
          shoppingItems: shoppingList.items.length,
        });

        setRecentRecipes(recipes.slice(0, 5));
      } catch {
        setError('Impossible de charger le tableau de bord.');
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center p-6">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card title="Tableau de bord">
        <p className="text-red-500">{error}</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-column gap-4">
      <div>
        <h1 className="mb-2">Tableau de bord</h1>
        <p className="mt-0 text-600">
          Vue d’ensemble de votre espace SUPMEAL.
        </p>
      </div>

      <div className="grid">
        <div className="col-12 md:col-6 xl:col-3">
          <Card>
            <div className="flex justify-content-between align-items-center">
              <div>
                <span className="block text-600 mb-2">Recettes</span>
                <span className="text-3xl font-bold">
                  {statistics.recipes}
                </span>
              </div>

              <i className="pi pi-book text-4xl text-primary" />
            </div>

            <Button
              label="Voir les recettes"
              icon="pi pi-arrow-right"
              text
              className="mt-3 p-0"
              onClick={() => navigate('/recettes')}
            />
          </Card>
        </div>

        <div className="col-12 md:col-6 xl:col-3">
          <Card>
            <div className="flex justify-content-between align-items-center">
              <div>
                <span className="block text-600 mb-2">Ingrédients</span>
                <span className="text-3xl font-bold">
                  {statistics.ingredients}
                </span>
              </div>

              <i className="pi pi-box text-4xl text-primary" />
            </div>

            <Button
              label="Voir les ingrédients"
              icon="pi pi-arrow-right"
              text
              className="mt-3 p-0"
              onClick={() => navigate('/ingredients')}
            />
          </Card>
        </div>

        <div className="col-12 md:col-6 xl:col-3">
          <Card>
            <div className="flex justify-content-between align-items-center">
              <div>
                <span className="block text-600 mb-2">Cookbooks</span>
                <span className="text-3xl font-bold">
                  {statistics.cookbooks}
                </span>
              </div>

              <i className="pi pi-users text-4xl text-primary" />
            </div>

            <Button
              label="Voir les cookbooks"
              icon="pi pi-arrow-right"
              text
              className="mt-3 p-0"
              onClick={() => navigate('/cookbooks')}
            />
          </Card>
        </div>

        <div className="col-12 md:col-6 xl:col-3">
          <Card>
            <div className="flex justify-content-between align-items-center">
              <div>
                <span className="block text-600 mb-2">
                  Articles à acheter
                </span>

                <span className="text-3xl font-bold">
                  {statistics.shoppingItems}
                </span>
              </div>

              <i className="pi pi-shopping-cart text-4xl text-primary" />
            </div>

            <Button
              label="Voir la liste"
              icon="pi pi-arrow-right"
              text
              className="mt-3 p-0"
              onClick={() => navigate('/liste-de-courses')}
            />
          </Card>
        </div>
      </div>

      <Card
        title="Recettes récentes"
        subTitle="Les dernières recettes disponibles dans votre espace"
      >
        {recentRecipes.length === 0 ? (
          <div>
            <p>Aucune recette pour le moment.</p>

            <Button
              label="Créer une recette"
              icon="pi pi-plus"
              onClick={() => navigate('/recettes/nouvelle')}
            />
          </div>
        ) : (
          <div className="flex flex-column gap-3">
            {recentRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="flex flex-column md:flex-row md:align-items-center justify-content-between gap-3 border-bottom-1 surface-border pb-3"
              >
                <div>
                  <strong className="block mb-1">{recipe.name}</strong>

                  <span className="text-600">
                    {recipe.description || 'Aucune description'}
                  </span>
                </div>

                <div className="flex align-items-center gap-3">
                  <span>
                    {recipe.servings
                      ? `${recipe.servings} portions`
                      : 'Portions non précisées'}
                  </span>

                  <Button
                    icon="pi pi-eye"
                    rounded
                    text
                    aria-label="Voir les recettes"
                    onClick={() => navigate('/recettes')}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Actions rapides">
        <div className="flex flex-wrap gap-2">
          <Button
            label="Nouvelle recette"
            icon="pi pi-plus"
            onClick={() => navigate('/recettes/nouvelle')}
          />

          <Button
            label="Ajouter un ingrédient"
            icon="pi pi-box"
            severity="secondary"
            onClick={() => navigate('/ingredients')}
          />

          <Button
            label="Créer un cookbook"
            icon="pi pi-users"
            severity="secondary"
            onClick={() => navigate('/cookbooks')}
          />

          <Button
            label="Liste de courses"
            icon="pi pi-shopping-cart"
            severity="secondary"
            onClick={() => navigate('/liste-de-courses')}
          />
        </div>
      </Card>
    </div>
  );
}

export default HomePage;