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
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';

import { getIngredients } from '../services/ingredientService';
import {
  createShoppingListItem,
  deleteShoppingListItem,
  generateShoppingListFromMealPlan,
  getShoppingList,
  updateShoppingListItem,
} from '../services/shoppingListService';
import type { Ingredient } from '../types/ingredient';
import type { ShoppingListItem } from '../types/shoppingList';

function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [selectedItem, setSelectedItem] =
    useState<ShoppingListItem | null>(null);

  const [ingredientId, setIngredientId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('');

  async function loadData() {
    try {
      setLoading(true);

      const [shoppingList, availableIngredients] = await Promise.all([
        getShoppingList(),
        getIngredients(),
      ]);

      setItems(shoppingList.items);
      setIngredients(availableIngredients);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return items;
    }

    return items.filter((item) => {
      return (
        item.ingredient.name.toLowerCase().includes(value) ||
        item.ingredient.category?.toLowerCase().includes(value) ||
        item.unit?.toLowerCase().includes(value)
      );
    });
  }, [items, search]);

  function openCreateDialog() {
    setSelectedItem(null);
    setIngredientId('');
    setQuantity(1);
    setUnit('');
    setDialogVisible(true);
  }

  function openEditDialog(item: ShoppingListItem) {
    setSelectedItem(item);
    setIngredientId(item.ingredientId);
    setQuantity(item.quantity);
    setUnit(item.unit ?? '');
    setDialogVisible(true);
  }

  async function saveItem() {
    if (!ingredientId || quantity <= 0) {
      return;
    }

    const data = {
      ingredientId,
      quantity,
      unit: unit.trim() || undefined,
    };

    if (selectedItem) {
      await updateShoppingListItem(selectedItem.id, data);
    } else {
      await createShoppingListItem(data);
    }

    setDialogVisible(false);
    await loadData();
  }

  function confirmDelete(item: ShoppingListItem) {
    confirmDialog({
      message: `Supprimer « ${item.ingredient.name} » de la liste ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        await deleteShoppingListItem(item.id);
        await loadData();
      },
    });
  }

  async function generateFromMealPlan() {
    try {
      setGenerating(true);
      const shoppingList = await generateShoppingListFromMealPlan();
      setItems(shoppingList.items);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Card title="Liste de courses">
      <ConfirmDialog />

      <Toolbar
        className="mb-3"
        start={() => (
          <div className="flex flex-wrap gap-2">
            <Button
              label="Ajouter un article"
              icon="pi pi-plus"
              onClick={openCreateDialog}
            />

            <Button
              label="Générer depuis le planning"
              icon="pi pi-calendar"
              severity="secondary"
              loading={generating}
              onClick={() => {
                void generateFromMealPlan();
              }}
            />
          </div>
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
        value={filteredItems}
        paginator
        rows={10}
        stripedRows
        showGridlines
        loading={loading}
        emptyMessage="La liste de courses est vide."
        sortMode="multiple"
        responsiveLayout="scroll"
      >
        <Column
          field="ingredient.name"
          header="Ingrédient"
          sortable
        />

        <Column
          field="ingredient.category"
          header="Catégorie"
          sortable
          body={(item: ShoppingListItem) =>
            item.ingredient.category || '-'
          }
        />

        <Column
          field="quantity"
          header="Quantité"
          sortable
        />

        <Column
          field="unit"
          header="Unité"
          sortable
          body={(item: ShoppingListItem) => item.unit || '-'}
        />

        <Column
          header="Actions"
          body={(item: ShoppingListItem) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                rounded
                text
                aria-label="Modifier"
                onClick={() => openEditDialog(item)}
              />

              <Button
                icon="pi pi-trash"
                severity="danger"
                rounded
                text
                aria-label="Supprimer"
                onClick={() => confirmDelete(item)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={
          selectedItem
            ? 'Modifier l’article'
            : 'Ajouter un article'
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
                void saveItem();
              }}
            />
          </div>
        }
      >
        <div className="flex flex-column gap-3">
          <div>
            <label
              htmlFor="shopping-ingredient"
              className="block mb-2"
            >
              Ingrédient
            </label>

            <Dropdown
              inputId="shopping-ingredient"
              className="w-full"
              value={ingredientId}
              options={ingredients}
              optionLabel="name"
              optionValue="id"
              placeholder="Sélectionner un ingrédient"
              filter
              onChange={(event) => setIngredientId(event.value)}
            />
          </div>

          <div>
            <label
              htmlFor="shopping-quantity"
              className="block mb-2"
            >
              Quantité
            </label>

            <InputNumber
              inputId="shopping-quantity"
              className="w-full"
              value={quantity}
              min={0.01}
              maxFractionDigits={2}
              onValueChange={(event) =>
                setQuantity(event.value ?? 1)
              }
            />
          </div>

          <div>
            <label
              htmlFor="shopping-unit"
              className="block mb-2"
            >
              Unité
            </label>

            <InputText
              id="shopping-unit"
              className="w-full"
              placeholder="g, kg, ml, unité..."
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
            />
          </div>
        </div>
      </Dialog>
    </Card>
  );
}

export default ShoppingListPage;