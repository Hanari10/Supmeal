import { useEffect, useState } from 'react';
import { getRecipes } from '../services/recipeService';
import type { Recipe } from '../types/recipe';
import { Link } from 'react-router-dom';

function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch {
        setError('Impossible de charger les recettes.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadRecipes();
  }, []);

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>Mes recettes</h1>

      <Link to="/recettes/nouvelle">
        Créer une recette
      </Link>

      {recipes.length === 0 ? (
        <p>Aucune recette.</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <strong>{recipe.name}</strong>

              {recipe.description && (
                <>
                  <br />
                  {recipe.description}
                </>
              )}

              {recipe.servings && (
                <>
                  <br />
                  {recipe.servings} portions
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default RecipesPage;