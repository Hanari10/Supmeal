import { useEffect, useMemo, useState } from 'react';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import {
  ConfirmDialog,
  confirmDialog,
} from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';

import {
  createMealPlan,
  deleteMealPlan,
  getMealPlans,
  updateMealPlan,
} from '../services/mealPlanService';
import { getRecipes } from '../services/recipeService';
import { useToast } from '../hooks/useToast';
import type {
  MealPlan,
  MealType,
  WeekDay,
} from '../types/mealPlan';
import type { Recipe } from '../types/recipe';

const dayOptions = [
  { label: 'Lundi', value: 'MONDAY' },
  { label: 'Mardi', value: 'TUESDAY' },
  { label: 'Mercredi', value: 'WEDNESDAY' },
  { label: 'Jeudi', value: 'THURSDAY' },
  { label: 'Vendredi', value: 'FRIDAY' },
  { label: 'Samedi', value: 'SATURDAY' },
  { label: 'Dimanche', value: 'SUNDAY' },
];

const mealTypeOptions = [
  { label: 'Petit-déjeuner', value: 'BREAKFAST' },
  { label: 'Déjeuner', value: 'LUNCH' },
  { label: 'Dîner', value: 'DINNER' },
];

const dayLabels: Record<WeekDay, string> = {
  MONDAY: 'Lundi',
  TUESDAY: 'Mardi',
  WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi',
  FRIDAY: 'Vendredi',
  SATURDAY: 'Samedi',
  SUNDAY: 'Dimanche',
};

const mealTypeLabels: Record<MealType, string> = {
  BREAKFAST: 'Petit-déjeuner',
  LUNCH: 'Déjeuner',
  DINNER: 'Dîner',
};

const dayOrder: Record<WeekDay, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

function MealPlansPage() {
  const { showSuccess, showError } = useToast();

  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [selectedMealPlan, setSelectedMealPlan] =
    useState<MealPlan | null>(null);

  const [recipeId, setRecipeId] = useState('');
  const [day, setDay] = useState<WeekDay>('MONDAY');
  const [mealType, setMealType] =
    useState<MealType>('DINNER');
  const [servings, setServings] = useState<number>(1);

  async function refreshData() {
    const [mealPlanData, recipeData] = await Promise.all([
      getMealPlans(),
      getRecipes(),
    ]);

    setMealPlans(mealPlanData);
    setRecipes(recipeData);
  }

  useEffect(() => {
    let isCancelled = false;

    Promise.all([getMealPlans(), getRecipes()])
      .then(([mealPlanData, recipeData]) => {
        if (!isCancelled) {
          setMealPlans(mealPlanData);
          setRecipes(recipeData);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          showError(
            'Chargement impossible',
            'Impossible de récupérer le planning.',
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

  const sortedMealPlans = useMemo(() => {
    return [...mealPlans].sort((first, second) => {
      const dayDifference =
        dayOrder[first.day] - dayOrder[second.day];

      if (dayDifference !== 0) {
        return dayDifference;
      }

      return first.mealType.localeCompare(second.mealType);
    });
  }, [mealPlans]);

  function openCreateDialog() {
    setSelectedMealPlan(null);
    setRecipeId('');
    setDay('MONDAY');
    setMealType('DINNER');
    setServings(1);
    setDialogVisible(true);
  }

  function openEditDialog(mealPlan: MealPlan) {
    setSelectedMealPlan(mealPlan);
    setRecipeId(mealPlan.recipeId);
    setDay(mealPlan.day);
    setMealType(mealPlan.mealType);
    setServings(
      mealPlan.servings ?? mealPlan.recipe.servings ?? 1,
    );
    setDialogVisible(true);
  }

  async function saveMealPlan() {
    if (!recipeId || servings <= 0) {
      showError(
        'Données invalides',
        'Sélectionne une recette et un nombre de portions valide.',
      );
      return;
    }

    const data = {
      recipeId,
      day,
      mealType,
      servings,
    };

    try {
      if (selectedMealPlan) {
        await updateMealPlan(selectedMealPlan.id, data);

        showSuccess(
          'Repas modifié',
          'Le planning a été mis à jour.',
        );
      } else {
        await createMealPlan(data);

        showSuccess(
          'Repas ajouté',
          'La recette a été ajoutée au planning.',
        );
      }

      setDialogVisible(false);
      await refreshData();
    } catch {
      showError(
        'Enregistrement impossible',
        'Un repas existe peut-être déjà sur ce créneau.',
      );
    }
  }

  function confirmDelete(mealPlan: MealPlan) {
    confirmDialog({
      message: `Supprimer « ${mealPlan.recipe.name} » du planning ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await deleteMealPlan(mealPlan.id);
          await refreshData();

          showSuccess(
            'Repas supprimé',
            'Le repas a été retiré du planning.',
          );
        } catch {
          showError(
            'Suppression impossible',
            'Le repas n’a pas pu être supprimé.',
          );
        }
      },
    });
  }

  return (
    <Card title="Planning des repas">
      <ConfirmDialog />

      <Toolbar
        className="mb-3"
        start={() => (
          <Button
            label="Planifier un repas"
            icon="pi pi-plus"
            onClick={openCreateDialog}
          />
        )}
      />

      <DataTable
        value={sortedMealPlans}
        paginator
        rows={10}
        stripedRows
        showGridlines
        loading={loading}
        emptyMessage="Aucun repas planifié."
        responsiveLayout="scroll"
      >
        <Column
          field="day"
          header="Jour"
          sortable
          body={(mealPlan: MealPlan) =>
            dayLabels[mealPlan.day]
          }
        />

        <Column
          field="mealType"
          header="Repas"
          sortable
          body={(mealPlan: MealPlan) => (
            <Tag value={mealTypeLabels[mealPlan.mealType]} />
          )}
        />

        <Column
          field="recipe.name"
          header="Recette"
          sortable
        />

        <Column
          field="servings"
          header="Portions"
          sortable
          body={(mealPlan: MealPlan) =>
            mealPlan.servings ??
            mealPlan.recipe.servings ??
            '-'
          }
        />

        <Column
          header="Actions"
          body={(mealPlan: MealPlan) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                rounded
                text
                aria-label="Modifier"
                tooltip="Modifier"
                tooltipOptions={{
                  position: 'top',
                }}
                onClick={() => openEditDialog(mealPlan)}
              />

              <Button
                icon="pi pi-trash"
                severity="danger"
                rounded
                text
                aria-label="Supprimer"
                tooltip="Supprimer"
                tooltipOptions={{
                  position: 'top',
                }}
                onClick={() => confirmDelete(mealPlan)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={
          selectedMealPlan
            ? 'Modifier le repas'
            : 'Planifier un repas'
        }
        visible={dialogVisible}
        style={{ width: '34rem', maxWidth: '95vw' }}
        modal
        onHide={() => setDialogVisible(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Annuler"
              severity="secondary"
              outlined
              onClick={() => setDialogVisible(false)}
            />

            <Button
              label="Enregistrer"
              icon="pi pi-check"
              onClick={() => {
                void saveMealPlan();
              }}
            />
          </div>
        }
      >
        <div className="flex flex-column gap-3">
          <div>
            <label
              htmlFor="meal-recipe"
              className="block mb-2"
            >
              Recette
            </label>

            <Dropdown
              inputId="meal-recipe"
              className="w-full"
              value={recipeId}
              options={recipes}
              optionLabel="name"
              optionValue="id"
              placeholder="Sélectionner une recette"
              filter
              onChange={(event) =>
                setRecipeId(event.value)
              }
            />
          </div>

          <div>
            <label
              htmlFor="meal-day"
              className="block mb-2"
            >
              Jour
            </label>

            <Dropdown
              inputId="meal-day"
              className="w-full"
              value={day}
              options={dayOptions}
              onChange={(event) =>
                setDay(event.value)
              }
            />
          </div>

          <div>
            <label
              htmlFor="meal-type"
              className="block mb-2"
            >
              Type de repas
            </label>

            <Dropdown
              inputId="meal-type"
              className="w-full"
              value={mealType}
              options={mealTypeOptions}
              onChange={(event) =>
                setMealType(event.value)
              }
            />
          </div>

          <div>
            <label
              htmlFor="meal-servings"
              className="block mb-2"
            >
              Portions
            </label>

            <InputNumber
              inputId="meal-servings"
              className="w-full"
              value={servings}
              min={1}
              onValueChange={(event) =>
                setServings(event.value ?? 1)
              }
            />
          </div>
        </div>
      </Dialog>
    </Card>
  );
}

export default MealPlansPage;