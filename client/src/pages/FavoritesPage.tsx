import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';

import {
  getFavorites,
  removeFavorite,
} from '../services/favoriteService';
import { useToast } from '../hooks/useToast';
import type { Favorite } from '../types/favorite';

function FavoritesPage() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [removingRecipeId, setRemovingRecipeId] = useState<
    string | null
  >(null);

  useEffect(() => {
    let isCancelled = false;

    getFavorites()
      .then((data) => {
        if (!isCancelled) {
          setFavorites(data);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          showError(
            'Chargement impossible',
            'Impossible de récupérer les favoris.',
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

  const filteredFavorites = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return favorites;
    }

    return favorites.filter((favorite) => {
      return (
        favorite.recipe.name.toLowerCase().includes(value) ||
        favorite.recipe.description?.toLowerCase().includes(value)
      );
    });
  }, [favorites, search]);

  async function handleRemoveFavorite(favorite: Favorite) {
    try {
      setRemovingRecipeId(favorite.recipeId);

      await removeFavorite(favorite.recipeId);

      setFavorites((currentFavorites) =>
        currentFavorites.filter(
          (item) => item.recipeId !== favorite.recipeId,
        ),
      );

      showSuccess(
        'Favori retiré',
        `« ${favorite.recipe.name} » a été retirée des favoris.`,
      );
    } catch {
      showError(
        'Suppression impossible',
        'La recette n’a pas pu être retirée des favoris.',
      );
    } finally {
      setRemovingRecipeId(null);
    }
  }

  return (
    <Card title="Mes recettes favorites">
      <Toolbar
        className="mb-3"
        start={() => (
          <Button
            label="Voir toutes les recettes"
            icon="pi pi-book"
            onClick={() => navigate('/recettes')}
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
        value={filteredFavorites}
        paginator
        rows={10}
        stripedRows
        showGridlines
        loading={loading}
        emptyMessage="Aucune recette favorite."
        responsiveLayout="scroll"
      >
        <Column
          header="Favori"
          body={(favorite: Favorite) => (
            <Button
              icon="pi pi-star-fill"
              severity="warning"
              text
              rounded
              loading={removingRecipeId === favorite.recipeId}
              aria-label="Retirer des favoris"
              onClick={() => {
                void handleRemoveFavorite(favorite);
              }}
            />
          )}
        />

        <Column field="recipe.name" header="Nom" sortable />

        <Column
          field="recipe.description"
          header="Description"
          body={(favorite: Favorite) =>
            favorite.recipe.description || '-'
          }
        />

        <Column
          field="recipe.servings"
          header="Portions"
          sortable
          body={(favorite: Favorite) =>
            favorite.recipe.servings ?? '-'
          }
        />

        <Column
          header="Préparation"
          body={(favorite: Favorite) =>
            favorite.recipe.preparationTime
              ? `${favorite.recipe.preparationTime} min`
              : '-'
          }
        />

        <Column
          header="Cuisson"
          body={(favorite: Favorite) =>
            favorite.recipe.cookingTime
              ? `${favorite.recipe.cookingTime} min`
              : '-'
          }
        />
      </DataTable>
    </Card>
  );
}

export default FavoritesPage;