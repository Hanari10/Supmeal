import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from '../services/favoriteService';
import { getRecipes } from '../services/recipeService';
import { useToast } from '../hooks/useToast';
import type { Recipe } from '../types/recipe';

type RecipeWithFavorite = Recipe & {
  isFavorite: boolean;
};

function RecipesPage() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const [recipes, setRecipes] = useState<RecipeWithFavorite[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingFavoriteId, setUpdatingFavoriteId] = useState<
    string | null
  >(null);

  useEffect(() => {
    let isCancelled = false;

    Promise.all([getRecipes(), getFavorites()])
      .then(([recipeData, favoriteData]) => {
        if (!isCancelled) {
          const favoriteIds = new Set(
            favoriteData.map((favorite) => favorite.recipeId),
          );

          setRecipes(
            recipeData.map((recipe) => ({
              ...recipe,
              isFavorite: favoriteIds.has(recipe.id),
            })),
          );
        }
      })
      .catch(() => {
        if (!isCancelled) {
          showError(
            'Chargement impossible',
            'Impossible de récupérer les recettes.',
          );
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [showError]);

  const filteredRecipes = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return recipes;
    }

    return recipes.filter((recipe) => {
      return (
        recipe.name.toLowerCase().includes(value) ||
        recipe.description?.toLowerCase().includes(value) ||
        recipe.instructions.toLowerCase().includes(value)
      );
    });
  }, [recipes, search]);

  async function toggleFavorite(recipe: RecipeWithFavorite) {
    try {
      setUpdatingFavoriteId(recipe.id);

      if (recipe.isFavorite) {
        await removeFavorite(recipe.id);

        setRecipes((currentRecipes) =>
          currentRecipes.map((currentRecipe) =>
            currentRecipe.id === recipe.id
              ? {
                  ...currentRecipe,
                  isFavorite: false,
                }
              : currentRecipe,
          ),
        );

        showSuccess(
          'Favori retiré',
          `« ${recipe.name} » a été retirée des favoris.`,
        );
      } else {
        await addFavorite(recipe.id);

        setRecipes((currentRecipes) =>
          currentRecipes.map((currentRecipe) =>
            currentRecipe.id === recipe.id
              ? {
                  ...currentRecipe,
                  isFavorite: true,
                }
              : currentRecipe,
          ),
        );

        showSuccess(
          'Favori ajouté',
          `« ${recipe.name} » a été ajoutée aux favoris.`,
        );
      }
    } catch {
      showError(
        'Modification impossible',
        'Le favori n’a pas pu être mis à jour.',
      );
    } finally {
      setUpdatingFavoriteId(null);
    }
  }

  return (
    <Card title="Mes recettes">
      <Toolbar
        className="mb-3"
        start={() => (
          <Button
            icon="pi pi-plus"
            label="Nouvelle recette"
            onClick={() => navigate('/recettes/nouvelle')}
          />
        )}
        end={() => (
          <span className="p-input-icon-left">
            <i className="pi pi-search" />

            <InputText
              placeholder="Rechercher..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </span>
        )}
      />

      <DataTable
        value={filteredRecipes}
        paginator
        rows={10}
        stripedRows
        showGridlines
        loading={loading}
        emptyMessage="Aucune recette."
        sortMode="multiple"
        responsiveLayout="scroll"
      >
        <Column
          header="Favori"
          body={(recipe: RecipeWithFavorite) => (
            <Button
              icon={recipe.isFavorite ? 'pi pi-star-fill' : 'pi pi-star'}
              severity={recipe.isFavorite ? 'warning' : 'secondary'}
                text
                rounded
                loading={updatingFavoriteId === recipe.id}
                aria-label={
                  recipe.isFavorite
                    ? 'Retirer des favoris'
                    : 'Ajouter aux favoris'
                }
                onClick={() => {
                  void toggleFavorite(recipe);
                }}
              />
            )}
        />

        <Column field="name" header="Nom" sortable />

        <Column field="description" header="Description" />

        <Column field="servings" header="Portions" sortable />

        <Column
          field="preparationTime"
          header="Préparation"
          sortable
          body={(recipe: Recipe) =>
            recipe.preparationTime
              ? `${recipe.preparationTime} min`
              : '-'
          }
        />

        <Column
          field="cookingTime"
          header="Cuisson"
          sortable
          body={(recipe: Recipe) =>
            recipe.cookingTime ? `${recipe.cookingTime} min` : '-'
          }
        />

        <Column
          header="Actions"
          body={() => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                rounded
                text
                aria-label="Modifier"
              />

              <Button
                icon="pi pi-trash"
                severity="danger"
                rounded
                text
                aria-label="Supprimer"
              />
            </div>
          )}
        />
      </DataTable>
    </Card>
  );
}

export default RecipesPage;