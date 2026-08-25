import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import {
  ConfirmDialog,
  confirmDialog,
} from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from '../services/favoriteService';

import { getCookbooks } from '../services/cookbookService';
import { getIngredients } from '../services/ingredientService';

import {
  deleteRecipe,
  searchRecipes,
} from '../services/recipeService';

import { useToast } from '../hooks/useToast';

import type {
  Recipe,
  RecipeSearchFilters,
} from '../types/recipe';

type RecipeWithFavorite = Recipe & {
  isFavorite: boolean;
};

interface SelectOption {
  label: string;
  value: string;
}

const difficultyOptions: SelectOption[] = [
  {
    label: 'Facile',
    value: 'Facile',
  },
  {
    label: 'Moyenne',
    value: 'Moyenne',
  },
  {
    label: 'Difficile',
    value: 'Difficile',
  },
];

function RecipesPage() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const [recipes, setRecipes] = useState<
    RecipeWithFavorite[]
  >([]);

  const [ingredientOptions, setIngredientOptions] =
    useState<SelectOption[]>([]);

  const [cookbookOptions, setCookbookOptions] =
    useState<SelectOption[]>([]);

  const [search, setSearch] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [tag, setTag] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [cookbookId, setCookbookId] = useState('');

  const [
    maxPreparationTime,
    setMaxPreparationTime,
  ] = useState<number | null>(null);

  const [
    maxCookingTime,
    setMaxCookingTime,
  ] = useState<number | null>(null);

  const [favoriteOnly, setFavoriteOnly] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [
    updatingFavoriteId,
    setUpdatingFavoriteId,
  ] = useState<string | null>(null);

  async function loadRecipes(
    filters: RecipeSearchFilters,
  ) {
    try {
      setLoading(true);

      const [
        recipeData,
        favoriteData,
      ] = await Promise.all([
        searchRecipes(filters),
        getFavorites(),
      ]);

      const favoriteIds = new Set(
        favoriteData.map(
          (favorite) => favorite.recipeId,
        ),
      );

      setRecipes(
        recipeData.map((recipe) => ({
          ...recipe,
          isFavorite: favoriteIds.has(recipe.id),
        })),
      );
    } catch {
      showError(
        'Chargement impossible',
        'Impossible de récupérer les recettes.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    async function initializePage() {
      try {
        const [
          ingredients,
          cookbooks,
          recipeData,
          favoriteData,
        ] = await Promise.all([
          getIngredients(),
          getCookbooks(),
          searchRecipes({}),
          getFavorites(),
        ]);

        if (isCancelled) {
          return;
        }

        setIngredientOptions(
          ingredients.map((currentIngredient) => ({
            label: currentIngredient.name,
            value: currentIngredient.name,
          })),
        );

        setCookbookOptions(
          cookbooks.map((cookbook) => ({
            label: cookbook.name,
            value: cookbook.id,
          })),
        );

        const favoriteIds = new Set(
          favoriteData.map(
            (favorite) => favorite.recipeId,
          ),
        );

        setRecipes(
          recipeData.map((recipe) => ({
            ...recipe,
            isFavorite: favoriteIds.has(recipe.id),
          })),
        );
      } catch {
        if (!isCancelled) {
          showError(
            'Chargement impossible',
            'Impossible de récupérer les recettes et les filtres.',
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    void initializePage();

    return () => {
      isCancelled = true;
    };
  }, [showError]);

  function getCurrentFilters(): RecipeSearchFilters {
    return {
      query: search.trim() || undefined,
      ingredient: ingredient || undefined,
      tag: tag.trim() || undefined,
      difficulty: difficulty || undefined,
      cookbookId: cookbookId || undefined,
      maxPreparationTime:
        maxPreparationTime ?? undefined,
      maxCookingTime:
        maxCookingTime ?? undefined,
      favorite: favoriteOnly || undefined,
    };
  }

  function applyFilters() {
    void loadRecipes(getCurrentFilters());
  }

  function resetFilters() {
    setSearch('');
    setIngredient('');
    setTag('');
    setDifficulty('');
    setCookbookId('');
    setMaxPreparationTime(null);
    setMaxCookingTime(null);
    setFavoriteOnly(false);

    void loadRecipes({});
  }

  async function toggleFavorite(
    recipe: RecipeWithFavorite,
  ) {
    try {
      setUpdatingFavoriteId(recipe.id);

      if (recipe.isFavorite) {
        await removeFavorite(recipe.id);

        if (favoriteOnly) {
          setRecipes((currentRecipes) =>
            currentRecipes.filter(
              (currentRecipe) =>
                currentRecipe.id !== recipe.id,
            ),
          );
        } else {
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
        }

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

  function confirmRecipeDelete(
    recipe: RecipeWithFavorite,
  ) {
    confirmDialog({
      message: `Supprimer la recette « ${recipe.name} » ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-danger',

      accept: async () => {
        try {
          await deleteRecipe(recipe.id);

          setRecipes((currentRecipes) =>
            currentRecipes.filter(
              (currentRecipe) =>
                currentRecipe.id !== recipe.id,
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
      recipe.recipeIngredients ?? [];

    if (recipeIngredients.length === 0) {
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
              key={recipeIngredient.ingredientId}
              className="text-sm"
            >
              <strong>
                {
                  recipeIngredient.ingredient
                    .name
                }
              </strong>

              {' — '}

              {recipeIngredient.quantity}

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
            {remainingCount > 1 ? 's' : ''}
            ...
          </span>
        )}
      </div>
    );
  }

  function tagsBody(
    recipe: RecipeWithFavorite,
  ) {
    const tags = recipe.tags ?? [];

    if (tags.length === 0) {
      return (
        <span className="text-500">
          Aucun
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((recipeTag) => (
          <span
            key={recipeTag.tag.id}
            className="px-2 py-1 border-round bg-primary-50 text-primary text-sm"
          >
            {recipeTag.tag.name}
          </span>
        ))}
      </div>
    );
  }

  function cookbookBody(
    recipe: RecipeWithFavorite,
  ) {
    if (!recipe.cookbookId) {
      return (
        <span className="text-500">
          Personnel
        </span>
      );
    }

    const cookbook =
      cookbookOptions.find(
        (option) =>
          option.value === recipe.cookbookId,
      );

    return cookbook?.label ?? 'Cookbook';
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
              navigate('/recettes/nouvelle')
            }
          />
        )}
      />

      <div className="surface-50 border-1 surface-border border-round p-3 mb-4">
        <div className="flex align-items-center gap-2 mb-3">
          <i className="pi pi-filter" />

          <h3 className="m-0">
            Recherche et filtres
          </h3>
        </div>

        <div className="grid">
          <div className="col-12">
            <label
              htmlFor="recipe-search"
              className="block mb-2 font-medium"
            >
              Recherche générale
            </label>

            <span className="p-input-icon-left w-full">
              <i className="pi pi-search" />

              <InputText
                id="recipe-search"
                className="w-full"
                placeholder="Titre, description, instructions, ingrédient ou tag..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    applyFilters();
                  }
                }}
              />
            </span>
          </div>

          <div className="col-12 md:col-6 lg:col-4">
            <label
              htmlFor="ingredient-filter"
              className="block mb-2 font-medium"
            >
              Ingrédient
            </label>

            <Dropdown
              inputId="ingredient-filter"
              className="w-full"
              value={ingredient}
              options={ingredientOptions}
              placeholder="Tous les ingrédients"
              filter
              showClear
              onChange={(event) =>
                setIngredient(
                  event.value ?? '',
                )
              }
            />
          </div>

          <div className="col-12 md:col-6 lg:col-4">
            <label
              htmlFor="tag-filter"
              className="block mb-2 font-medium"
            >
              Catégorie / tag
            </label>

            <InputText
              id="tag-filter"
              className="w-full"
              value={tag}
              placeholder="Ex. Dessert, Italien..."
              onChange={(event) =>
                setTag(event.target.value)
              }
            />
          </div>

          <div className="col-12 md:col-6 lg:col-4">
            <label
              htmlFor="difficulty-filter"
              className="block mb-2 font-medium"
            >
              Difficulté
            </label>

            <Dropdown
              inputId="difficulty-filter"
              className="w-full"
              value={difficulty}
              options={difficultyOptions}
              placeholder="Toutes les difficultés"
              showClear
              onChange={(event) =>
                setDifficulty(
                  event.value ?? '',
                )
              }
            />
          </div>

          <div className="col-12 md:col-6 lg:col-4">
            <label
              htmlFor="preparation-filter"
              className="block mb-2 font-medium"
            >
              Préparation maximale
            </label>

            <InputNumber
              inputId="preparation-filter"
              className="w-full"
              value={maxPreparationTime}
              min={0}
              suffix=" min"
              placeholder="Aucune limite"
              showButtons
              onValueChange={(event) =>
                setMaxPreparationTime(
                  event.value ?? null,
                )
              }
            />
          </div>

          <div className="col-12 md:col-6 lg:col-4">
            <label
              htmlFor="cooking-filter"
              className="block mb-2 font-medium"
            >
              Cuisson maximale
            </label>

            <InputNumber
              inputId="cooking-filter"
              className="w-full"
              value={maxCookingTime}
              min={0}
              suffix=" min"
              placeholder="Aucune limite"
              showButtons
              onValueChange={(event) =>
                setMaxCookingTime(
                  event.value ?? null,
                )
              }
            />
          </div>

          <div className="col-12 md:col-6 lg:col-4">
            <label
              htmlFor="cookbook-filter"
              className="block mb-2 font-medium"
            >
              Cookbook
            </label>

            <Dropdown
              inputId="cookbook-filter"
              className="w-full"
              value={cookbookId}
              options={cookbookOptions}
              placeholder="Tous les cookbooks"
              showClear
              onChange={(event) =>
                setCookbookId(
                  event.value ?? '',
                )
              }
            />
          </div>

          <div className="col-12">
            <div className="flex align-items-center gap-2">
              <Checkbox
                inputId="favorite-filter"
                checked={favoriteOnly}
                onChange={(event) =>
                  setFavoriteOnly(
                    event.checked ?? false,
                  )
                }
              />

              <label
                htmlFor="favorite-filter"
                className="cursor-pointer"
              >
                Afficher uniquement les favoris
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-content-end gap-2 mt-3">
          <Button
            type="button"
            label="Réinitialiser"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            onClick={resetFilters}
          />

          <Button
            type="button"
            label="Appliquer les filtres"
            icon="pi pi-filter"
            onClick={applyFilters}
            loading={loading}
          />
        </div>
      </div>

      <div className="flex justify-content-between align-items-center mb-3">
        <span className="text-600">
          {recipes.length}{' '}
          recette
          {recipes.length > 1 ? 's' : ''}
          {' '}trouvée
          {recipes.length > 1 ? 's' : ''}
        </span>
      </div>

      <DataTable
        value={recipes}
        paginator
        rows={10}
        stripedRows
        showGridlines
        loading={loading}
        emptyMessage="Aucune recette ne correspond aux critères."
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
                void toggleFavorite(recipe);
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
            recipe.description || '-'
          }
        />

        <Column
          header="Ingrédients"
          body={ingredientsBody}
        />

        <Column
          header="Tags"
          body={tagsBody}
        />

        <Column
          header="Cookbook"
          body={cookbookBody}
        />

        <Column
          field="servings"
          header="Portions"
          sortable
          body={(
            recipe: RecipeWithFavorite,
          ) =>
            recipe.servings ?? '-'
          }
        />

        <Column
          field="preparationTime"
          header="Préparation"
          sortable
          body={(
            recipe: RecipeWithFavorite,
          ) =>
            recipe.preparationTime !==
              null &&
            recipe.preparationTime !==
              undefined
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
            recipe.cookingTime !== null &&
            recipe.cookingTime !== undefined
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
                  confirmRecipeDelete(recipe)
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