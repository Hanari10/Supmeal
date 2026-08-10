import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import {
  ConfirmDialog,
  confirmDialog,
} from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from '../services/favoriteService';

import {
  deleteRecipe,
  getRecipes,
} from '../services/recipeService';

import { useToast } from '../hooks/useToast';
import type { Recipe } from '../types/recipe';

type RecipeWithFavorite = Recipe & {
  isFavorite: boolean;
};

function RecipesPage() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const [recipes, setRecipes] = useState<
    RecipeWithFavorite[]
  >([]);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [
    updatingFavoriteId,
    setUpdatingFavoriteId,
  ] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    Promise.all([
      getRecipes(),
      getFavorites(),
    ])
      .then(
        ([
          recipeData,
          favoriteData,
        ]) => {
          if (!isCancelled) {
            const favoriteIds =
              new Set(
                favoriteData.map(
                  (favorite) =>
                    favorite.recipeId,
                ),
              );

            setRecipes(
              recipeData.map(
                (recipe) => ({
                  ...recipe,

                  isFavorite:
                    favoriteIds.has(
                      recipe.id,
                    ),
                }),
              ),
            );
          }
        },
      )
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
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return recipes;
    }

    return recipes.filter(
      (recipe) => {
        const ingredientMatch =
          recipe.recipeIngredients?.some(
            (recipeIngredient) =>
              recipeIngredient.ingredient.name
                .toLowerCase()
                .includes(value),
          );

        return (
          recipe.name
            .toLowerCase()
            .includes(value) ||
          recipe.description
            ?.toLowerCase()
            .includes(value) ||
          recipe.instructions
            .toLowerCase()
            .includes(value) ||
          ingredientMatch
        );
      },
    );
  }, [recipes, search]);

  async function toggleFavorite(
    recipe: RecipeWithFavorite,
  ) {
    try {
      setUpdatingFavoriteId(
        recipe.id,
      );

      if (recipe.isFavorite) {
        await removeFavorite(
          recipe.id,
        );

        setRecipes(
          (currentRecipes) =>
            currentRecipes.map(
              (currentRecipe) =>
                currentRecipe.id ===
                recipe.id
                  ? {
                      ...currentRecipe,
                      isFavorite:
                        false,
                    }
                  : currentRecipe,
            ),
        );

        showSuccess(
          'Favori retiré',
          `« ${recipe.name} » a été retirée des favoris.`,
        );
      } else {
        await addFavorite(
          recipe.id,
        );

        setRecipes(
          (currentRecipes) =>
            currentRecipes.map(
              (currentRecipe) =>
                currentRecipe.id ===
                recipe.id
                  ? {
                      ...currentRecipe,
                      isFavorite:
                        true,
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

  function confirmRecipeDelete(
    recipe: RecipeWithFavorite,
  ) {
    confirmDialog({
      message: `Supprimer la recette « ${recipe.name} » ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptClassName:
        'p-button-danger',

      accept: async () => {
        try {
          await deleteRecipe(
            recipe.id,
          );

          setRecipes(
            (currentRecipes) =>
              currentRecipes.filter(
                (currentRecipe) =>
                  currentRecipe.id !==
                  recipe.id,
              ),
          );

          showSuccess(
            'Recette supprimée',
            `« ${recipe.name} » a été supprimée.`,
          );
        } catch {
          showError(
            'Suppression impossible',
            'La recette n’a pas pu être supprimée.',
          );
        }
      },
    });
  }

  function ingredientsBody(
    recipe: RecipeWithFavorite,
  ) {
    const recipeIngredients =
      recipe.recipeIngredients ??
      [];

    if (
      recipeIngredients.length === 0
    ) {
      return (
        <span className="text-500">
          Aucun
        </span>
      );
    }

    const visibleIngredients =
      recipeIngredients.slice(0, 4);

    const remainingCount =
      recipeIngredients.length -
      visibleIngredients.length;

    return (
      <div className="flex flex-column gap-1">
        {visibleIngredients.map(
          (recipeIngredient) => (
            <span
              key={
                recipeIngredient.ingredientId
              }
              className="text-sm"
            >
              <strong>
                {
                  recipeIngredient
                    .ingredient.name
                }
              </strong>

              {' — '}

              {
                recipeIngredient.quantity
              }

              {recipeIngredient.unit
                ? ` ${recipeIngredient.unit}`
                : ''}
            </span>
          ),
        )}

        {remainingCount > 0 && (
          <span className="text-sm text-500 font-italic">
            +{remainingCount}{' '}
            autre
            {remainingCount > 1
              ? 's'
              : ''}
            ...
          </span>
        )}
      </div>
    );
  }

  return (
    <Card title="Mes recettes">
      <ConfirmDialog />

      <Toolbar
        className="mb-3"
        start={() => (
          <Button
            icon="pi pi-plus"
            label="Nouvelle recette"
            onClick={() =>
              navigate(
                '/recettes/nouvelle',
              )
            }
          />
        )}
        end={() => (
          <span className="p-input-icon-left">
            <i className="pi pi-search" />

            <InputText
              placeholder="Rechercher..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
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
          body={(
            recipe: RecipeWithFavorite,
          ) => (
            <Button
              icon={
                recipe.isFavorite
                  ? 'pi pi-star-fill'
                  : 'pi pi-star'
              }
              severity={
                recipe.isFavorite
                  ? 'warning'
                  : 'secondary'
              }
              text
              rounded
              loading={
                updatingFavoriteId ===
                recipe.id
              }
              tooltip={
                recipe.isFavorite
                  ? 'Retirer des favoris'
                  : 'Ajouter aux favoris'
              }
              tooltipOptions={{
                position: 'top',
              }}
              aria-label={
                recipe.isFavorite
                  ? 'Retirer des favoris'
                  : 'Ajouter aux favoris'
              }
              onClick={() => {
                void toggleFavorite(
                  recipe,
                );
              }}
            />
          )}
        />

        <Column
          field="name"
          header="Nom"
          sortable
        />

        <Column
          field="description"
          header="Description"
          body={(
            recipe: RecipeWithFavorite,
          ) =>
            recipe.description ||
            '-'
          }
        />

        <Column
          header="Ingrédients"
          body={ingredientsBody}
        />

        <Column
          field="servings"
          header="Portions"
          sortable
          body={(
            recipe: RecipeWithFavorite,
          ) =>
            recipe.servings ??
            '-'
          }
        />

        <Column
          field="preparationTime"
          header="Préparation"
          sortable
          body={(
            recipe: RecipeWithFavorite,
          ) =>
            recipe.preparationTime
              ? `${recipe.preparationTime} min`
              : '-'
          }
        />

        <Column
          field="cookingTime"
          header="Cuisson"
          sortable
          body={(
            recipe: RecipeWithFavorite,
          ) =>
            recipe.cookingTime
              ? `${recipe.cookingTime} min`
              : '-'
          }
        />

        <Column
          header="Actions"
          body={(
            recipe: RecipeWithFavorite,
          ) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-eye"
                rounded
                text
                tooltip="Voir"
                tooltipOptions={{
                  position: 'top',
                }}
                aria-label="Voir"
                onClick={() =>
                  navigate(
                    `/recettes/${recipe.id}`,
                  )
                }
              />

              <Button
                icon="pi pi-pencil"
                rounded
                text
                tooltip="Modifier"
                tooltipOptions={{
                  position: 'top',
                }}
                aria-label="Modifier"
                onClick={() =>
                  navigate(
                    `/recettes/${recipe.id}/modifier`,
                  )
                }
              />

              <Button
                icon="pi pi-trash"
                severity="danger"
                rounded
                text
                tooltip="Supprimer"
                tooltipOptions={{
                  position: 'top',
                }}
                aria-label="Supprimer"
                onClick={() =>
                  confirmRecipeDelete(
                    recipe,
                  )
                }
              />
            </div>
          )}
        />
      </DataTable>
    </Card>
  );
}

export default RecipesPage;