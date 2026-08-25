import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';

import { getRecipe } from '../services/recipeService';
import { getRecipeIngredients } from '../services/recipeIngredientService';

import { useToast } from '../hooks/useToast';

import type { Recipe } from '../types/recipe';
import type { RecipeIngredient } from '../types/recipeIngredient';

function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredient[]
  >([]);

  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    let isCancelled = false;

    if (!id) {
      return;
    }

    Promise.all([
      getRecipe(id),
      getRecipeIngredients(id),
    ])
      .then(([recipeData, ingredientData]) => {
        if (isCancelled) {
          return;
        }

        setRecipe(recipeData);
        setRecipeIngredients(ingredientData);
      })
      .catch(() => {
        if (!isCancelled) {
          showError(
            'Chargement impossible',
            'La recette n’a pas pu être récupérée.',
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
  }, [id, showError]);

  if (loading) {
    return (
      <div className="flex justify-content-center p-6">
        <ProgressSpinner />
      </div>
    );
  }

  if (!recipe) {
    return (
      <Card title="Recette introuvable">
        <Button
          label="Retour aux recettes"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          onClick={() => navigate('/recettes')}
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-column gap-4">
      <Toolbar
        start={() => (
          <Button
            icon="pi pi-arrow-left"
            rounded
            text
            tooltip="Retour aux recettes"
            tooltipOptions={{
              position: 'top',
            }}
            aria-label="Retour aux recettes"
            onClick={() => navigate('/recettes')}
          />
        )}
        end={() => (
          <Button
            icon="pi pi-pencil"
            rounded
            text
            tooltip="Modifier la recette"
            tooltipOptions={{
              position: 'top',
            }}
            aria-label="Modifier la recette"
            onClick={() =>
              navigate(`/recettes/${recipe.id}/modifier`)
            }
          />
        )}
      />

      <Card>
        <div className="grid">
          {recipe.imageUrl && (
            <div className="col-12 lg:col-5">
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                style={{
                  width: '100%',
                  maxHeight: '420px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                }}
              />
            </div>
          )}

          <div
            className={
              recipe.imageUrl
                ? 'col-12 lg:col-7'
                : 'col-12'
            }
          >
            <div className="flex flex-column gap-3">
              <div>
                <h1 className="mt-0 mb-2">
                  {recipe.name}
                </h1>

                <p className="text-600 text-lg mt-0">
                  {recipe.description ||
                    'Aucune description.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Tag
                  icon="pi pi-users"
                  value={`${
                    recipe.servings ?? '-'
                  } portion(s)`}
                  severity="info"
                />

                <Tag
                  icon="pi pi-clock"
                  value={`Préparation : ${
                    recipe.preparationTime
                      ? `${recipe.preparationTime} min`
                      : '-'
                  }`}
                  severity="success"
                />

                <Tag
                  icon="pi pi-stopwatch"
                  value={`Cuisson : ${
                    recipe.cookingTime
                      ? `${recipe.cookingTime} min`
                      : '-'
                  }`}
                  severity="warning"
                />

                <Tag
                  icon="pi pi-chart-bar"
                  value={`Difficulté : ${
                    recipe.difficulty || '-'
                  }`}
                  severity="secondary"
                />
              </div>
              {recipe.tags && recipe.tags.length > 0 && (
                <div>
                  <h3 className="mt-2 mb-2">
                    Catégories / Tags
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((recipeTag) => (
                      <Tag
                        key={recipeTag.tag.id}
                        icon="pi pi-tag"
                        value={recipeTag.tag.name}
                        severity="info"
                      />
                    ))}
                  </div>
                </div>
              )}

              {recipe.sourceUrl && (
                <div>
                  <h3 className="mt-2 mb-2">
                    Source
                  </h3>

                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    {recipe.sourceUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card title="Ingrédients">
        <DataTable
          value={recipeIngredients}
          stripedRows
          showGridlines
          emptyMessage="Aucun ingrédient renseigné pour cette recette."
          responsiveLayout="scroll"
        >
          <Column
            header="Ingrédient"
            field="ingredient.name"
            body={(recipeIngredient: RecipeIngredient) =>
              recipeIngredient.ingredient.name
            }
          />

          <Column
            header="Quantité"
            field="quantity"
            body={(recipeIngredient: RecipeIngredient) =>
              recipeIngredient.quantity
            }
          />

          <Column
            header="Unité"
            field="unit"
            body={(recipeIngredient: RecipeIngredient) =>
              recipeIngredient.unit ||
              recipeIngredient.ingredient
                .defaultMeasurementUnit ||
              '-'
            }
          />
        </DataTable>
      </Card>

      <Card title="Instructions">
        <div
          style={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.7,
          }}
        >
          {recipe.instructions}
        </div>
      </Card>

      <Divider />

      <div className="flex flex-wrap justify-content-end gap-2">
        <Button
          icon="pi pi-arrow-left"
          rounded
          text
          tooltip="Retour"
          tooltipOptions={{
            position: 'top',
          }}
          aria-label="Retour"
          onClick={() => navigate('/recettes')}
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
            navigate(`/recettes/${recipe.id}/modifier`)
          }
        />
      </div>
    </div>
  );
}

export default RecipeDetailsPage;