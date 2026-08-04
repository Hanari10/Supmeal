import { useEffect, useMemo, useState } from 'react';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';

import {
  createIngredient,
  deleteIngredient,
  getIngredients,
  updateIngredient,
} from '../services/ingredientService';
import type { Ingredient } from '../types/ingredient';

function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [defaultMeasurementUnit, setDefaultMeasurementUnit] = useState('');

  async function loadIngredients() {
    try {
      setLoading(true);
      const data = await getIngredients();
      setIngredients(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadIngredients();
  }, []);

  const filteredIngredients = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return ingredients;
    }

    return ingredients.filter((ingredient) => {
      return (
        ingredient.name.toLowerCase().includes(value) ||
        ingredient.category?.toLowerCase().includes(value) ||
        ingredient.defaultMeasurementUnit?.toLowerCase().includes(value)
      );
    });
  }, [ingredients, search]);

  function openCreateDialog() {
    setSelectedIngredient(null);
    setName('');
    setCategory('');
    setDefaultMeasurementUnit('');
    setDialogVisible(true);
  }

  function openEditDialog(ingredient: Ingredient) {
    setSelectedIngredient(ingredient);
    setName(ingredient.name);
    setCategory(ingredient.category ?? '');
    setDefaultMeasurementUnit(ingredient.defaultMeasurementUnit ?? '');
    setDialogVisible(true);
  }

  async function saveIngredient() {
    const data = {
      name: name.trim(),
      category: category.trim() || undefined,
      defaultMeasurementUnit:
        defaultMeasurementUnit.trim() || undefined,
    };

    if (!data.name) {
      return;
    }

    if (selectedIngredient) {
      await updateIngredient(selectedIngredient.id, data);
    } else {
      await createIngredient(data);
    }

    setDialogVisible(false);
    await loadIngredients();
  }

  function confirmDelete(ingredient: Ingredient) {
    confirmDialog({
      message: `Supprimer l’ingrédient « ${ingredient.name} » ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        await deleteIngredient(ingredient.id);
        await loadIngredients();
      },
    });
  }

  return (
    <Card title="Ingrédients">
      <ConfirmDialog />

      <Toolbar
        className="mb-3"
        start={() => (
          <Button
            label="Nouvel ingrédient"
            icon="pi pi-plus"
            onClick={openCreateDialog}
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
        value={filteredIngredients}
        paginator
        rows={10}
        stripedRows
        showGridlines
        loading={loading}
        emptyMessage="Aucun ingrédient."
        sortMode="multiple"
        responsiveLayout="scroll"
      >
        <Column field="name" header="Nom" sortable />

        <Column
          field="category"
          header="Catégorie"
          sortable
          body={(ingredient: Ingredient) =>
            ingredient.category || '-'
          }
        />

        <Column
          field="defaultMeasurementUnit"
          header="Unité par défaut"
          sortable
          body={(ingredient: Ingredient) =>
            ingredient.defaultMeasurementUnit || '-'
          }
        />

        <Column
          header="Actions"
          body={(ingredient: Ingredient) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                rounded
                text
                aria-label="Modifier"
                onClick={() => openEditDialog(ingredient)}
              />

              <Button
                icon="pi pi-trash"
                severity="danger"
                rounded
                text
                aria-label="Supprimer"
                onClick={() => confirmDelete(ingredient)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={
          selectedIngredient
            ? 'Modifier l’ingrédient'
            : 'Nouvel ingrédient'
        }
        visible={dialogVisible}
        style={{ width: '32rem', maxWidth: '95vw' }}
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
                void saveIngredient();
              }}
            />
          </div>
        }
      >
        <div className="flex flex-column gap-3">
          <div>
            <label htmlFor="ingredient-name" className="block mb-2">
              Nom
            </label>

            <InputText
              id="ingredient-name"
              className="w-full"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="ingredient-category" className="block mb-2">
              Catégorie
            </label>

            <InputText
              id="ingredient-category"
              className="w-full"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="ingredient-unit" className="block mb-2">
              Unité par défaut
            </label>

            <InputText
              id="ingredient-unit"
              className="w-full"
              placeholder="g, kg, ml..."
              value={defaultMeasurementUnit}
              onChange={(event) =>
                setDefaultMeasurementUnit(event.target.value)
              }
            />
          </div>
        </div>
      </Dialog>
    </Card>
  );
}

export default IngredientsPage;