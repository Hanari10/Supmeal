import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';

import { getRecipes } from '../services/recipeService';
import type { Recipe } from '../types/recipe';

function RecipesPage() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecipes() {
      const data = await getRecipes();

      setRecipes(data);
      setLoading(false);
    }

    void loadRecipes();
  }, []);

  const filteredRecipes = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return recipes;
    }

    return recipes.filter((recipe) => {
      return (
        recipe.name.toLowerCase().includes(value) ||
        recipe.description?.toLowerCase().includes(value) ||
        recipe.instructions?.toLowerCase().includes(value)
      );
    });
  }, [recipes, search]);

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
          field="name"
          header="Nom"
          sortable
        />

        <Column
          field="description"
          header="Description"
        />

        <Column
          field="servings"
          header="Portions"
          sortable
        />

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
            recipe.cookingTime
              ? `${recipe.cookingTime} min`
              : '-'
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
              />

              <Button
                icon="pi pi-trash"
                severity="danger"
                rounded
                text
              />

            </div>
          )}
        />

      </DataTable>

    </Card>
  );
}

export default RecipesPage;