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
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';

import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import {
  addCookbookMember,
  addCookbookRecipe,
  createCookbook,
  deleteCookbook,
  getCookbooks,
  removeCookbookMember,
  removeCookbookRecipe,
  updateCookbook,
} from '../services/cookbookService';
import { getRecipes } from '../services/recipeService';
import type {
  Cookbook,
  CookbookMember,
  CookbookRecipe,
  CookbookRole,
} from '../types/cookbook';
import type { Recipe } from '../types/recipe';

const roleOptions = [
  { label: 'Éditeur', value: 'EDITOR' },
  { label: 'Lecteur', value: 'READER' },
  { label: 'Commentateur', value: 'COMMENTER' },
];

const roleLabels: Record<CookbookRole, string> = {
  CREATOR: 'Créateur',
  EDITOR: 'Éditeur',
  READER: 'Lecteur',
  COMMENTER: 'Commentateur',
};

function CookbooksPage() {
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const [cookbooks, setCookbooks] = useState<Cookbook[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [cookbookDialogVisible, setCookbookDialogVisible] =
    useState(false);
  const [memberDialogVisible, setMemberDialogVisible] =
    useState(false);
  const [detailsDialogVisible, setDetailsDialogVisible] =
    useState(false);
  const [recipeDialogVisible, setRecipeDialogVisible] =
    useState(false);

  const [selectedCookbook, setSelectedCookbook] =
    useState<Cookbook | null>(null);

  const [selectedRecipeId, setSelectedRecipeId] =
    useState<string | null>(null);

  const [name, setName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] =
    useState<Exclude<CookbookRole, 'CREATOR'>>('READER');

  async function loadCookbooks() {
    try {
      setLoading(true);

      const data = await getCookbooks();

      setCookbooks(data);
    } finally {
      setLoading(false);
    }
  }

  async function loadRecipes() {
    const data = await getRecipes();
    setRecipes(data);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      try {
        const [cookbooksData, recipesData] = await Promise.all([
          getCookbooks(),
          getRecipes(),
        ]);

        if (cancelled) {
          return;
        }

        setCookbooks(cookbooksData);
        setRecipes(recipesData);
      } catch {
        if (!cancelled) {
          showError(
            'Chargement impossible',
            'Les cookbooks n’ont pas pu être chargés.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      cancelled = true;
    };
  }, [showError]);

  const filteredCookbooks = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return cookbooks;
    }

    return cookbooks.filter((cookbook) =>
      cookbook.name.toLowerCase().includes(value),
    );
  }, [cookbooks, search]);

  const availableRecipes = useMemo(() => {
    if (!selectedCookbook) {
      return [];
    }

    const recipeIds = new Set(
      selectedCookbook.recipes.map((recipe) => recipe.id),
    );

    return recipes.filter(
      (recipe) => !recipeIds.has(recipe.id),
    );
  }, [recipes, selectedCookbook]);

  function openCreateDialog() {
    setSelectedCookbook(null);
    setName('');
    setCookbookDialogVisible(true);
  }

  function openEditDialog(cookbook: Cookbook) {
    setSelectedCookbook(cookbook);
    setName(cookbook.name);
    setCookbookDialogVisible(true);
  }

  function openMemberDialog(cookbook: Cookbook) {
    setSelectedCookbook(cookbook);
    setMemberEmail('');
    setMemberRole('READER');
    setMemberDialogVisible(true);
  }

  function openDetailsDialog(cookbook: Cookbook) {
    setSelectedCookbook(cookbook);
    setDetailsDialogVisible(true);
  }

  function openRecipeDialog(cookbook: Cookbook) {
    setSelectedCookbook(cookbook);
    setSelectedRecipeId(null);
    setRecipeDialogVisible(true);
  }

  async function saveCookbook() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      showError(
        'Nom obligatoire',
        'Le cookbook doit posséder un nom.',
      );
      return;
    }

    try {
      if (selectedCookbook) {
        await updateCookbook(selectedCookbook.id, {
          name: trimmedName,
        });

        showSuccess(
          'Cookbook modifié',
          `Le cookbook « ${trimmedName} » a été modifié.`,
        );
      } else {
        await createCookbook({
          name: trimmedName,
        });

        showSuccess(
          'Cookbook créé',
          `Le cookbook « ${trimmedName} » a été créé.`,
        );
      }

      setCookbookDialogVisible(false);
      await loadCookbooks();
    } catch {
      showError(
        'Enregistrement impossible',
        'Le cookbook n’a pas pu être enregistré.',
      );
    }
  }

  async function saveMember() {
    if (!selectedCookbook || !memberEmail.trim()) {
      showError(
        'Informations manquantes',
        'Veuillez renseigner une adresse e-mail.',
      );
      return;
    }

    const email = memberEmail.trim();
    const cookbookId = selectedCookbook.id;
    const cookbookName = selectedCookbook.name;

    try {
      await addCookbookMember(cookbookId, {
        email,
        role: memberRole,
      });

      const updatedCookbooks = await getCookbooks();

      setCookbooks(updatedCookbooks);

      const updatedCookbook = updatedCookbooks.find(
        (cookbook) => cookbook.id === cookbookId,
      );

      setSelectedCookbook(updatedCookbook ?? null);

      setMemberDialogVisible(false);
      setMemberEmail('');
      setMemberRole('READER');

      showSuccess(
        'Membre ajouté',
        `${email} a été ajouté au cookbook « ${cookbookName} ».`,
      );
    } catch {
      showError(
        'Ajout impossible',
        'Le membre n’a pas pu être ajouté. Vérifiez que cette adresse correspond à un compte SUPMEAL existant et que l’utilisateur n’est pas déjà membre du cookbook.',
      );
    }
  }

  async function saveRecipe() {
    if (!selectedCookbook || !selectedRecipeId) {
      return;
    }

    try {
      const recipe = recipes.find(
        (item) => item.id === selectedRecipeId,
      );

      const cookbookName = selectedCookbook.name;

      const updatedCookbook = await addCookbookRecipe(
        selectedCookbook.id,
        {
          recipeId: selectedRecipeId,
        },
      );

      setSelectedCookbook(updatedCookbook);
      setRecipeDialogVisible(false);
      setSelectedRecipeId(null);

      await loadCookbooks();
      await loadRecipes();

      showSuccess(
        'Recette ajoutée',
        recipe
          ? `« ${recipe.name} » a été ajoutée au cookbook « ${cookbookName} ».`
          : 'La recette a été ajoutée au cookbook.',
      );
    } catch {
      showError(
        'Ajout impossible',
        'La recette n’a pas pu être ajoutée au cookbook.',
      );
    }
  }

  function confirmCookbookDelete(cookbook: Cookbook) {
    confirmDialog({
      message: `Supprimer le cookbook « ${cookbook.name} » ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await deleteCookbook(cookbook.id);
          await loadCookbooks();

          if (selectedCookbook?.id === cookbook.id) {
            setSelectedCookbook(null);
            setDetailsDialogVisible(false);
          }

          showSuccess(
            'Cookbook supprimé',
            `Le cookbook « ${cookbook.name} » a été supprimé.`,
          );
        } catch {
          showError(
            'Suppression impossible',
            'Le cookbook n’a pas pu être supprimé.',
          );
        }
      },
    });
  }

  function confirmMemberDelete(
    cookbook: Cookbook,
    member: CookbookMember,
  ) {
    const memberEmail =
      member.user?.email ?? 'Cet utilisateur';

    confirmDialog({
      message: `Retirer ${memberEmail} du cookbook « ${cookbook.name} » ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Retirer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-danger',

      accept: async () => {
        try {
          await removeCookbookMember(
            cookbook.id,
            member.id,
          );

          const updatedCookbooks = await getCookbooks();

          setCookbooks(updatedCookbooks);

          const updatedCookbook = updatedCookbooks.find(
            (item) => item.id === cookbook.id,
          );

          setSelectedCookbook(updatedCookbook ?? null);

          showSuccess(
            'Membre retiré',
            `${memberEmail} a été retiré du cookbook « ${cookbook.name} ».`,
          );
        } catch {
          showError(
            'Suppression impossible',
            'Le membre n’a pas pu être retiré du cookbook.',
          );
        }
      },
    });
  }

  function confirmRecipeDelete(
    cookbook: Cookbook,
    recipe: CookbookRecipe,
  ) {
    confirmDialog({
      message: `Retirer la recette « ${recipe.name} » du cookbook ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Retirer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-danger',

      accept: async () => {
        try {
          const updatedCookbook =
            await removeCookbookRecipe(
              cookbook.id,
              recipe.id,
            );

          setSelectedCookbook(updatedCookbook);

          await loadCookbooks();
          await loadRecipes();

          showSuccess(
            'Recette retirée',
            `« ${recipe.name} » a été retirée du cookbook « ${cookbook.name} ».`,
          );
        } catch {
          showError(
            'Suppression impossible',
            'La recette n’a pas pu être retirée du cookbook.',
          );
        }
      },
    });
  }

  function isOwner(cookbook: Cookbook) {
    return cookbook.ownerId === user?.id;
  }

  function currentMembership(cookbook: Cookbook) {
    return cookbook.members.find(
      (member) => member.userId === user?.id,
    );
  }

  function canAddRecipe(cookbook: Cookbook) {
    const membership = currentMembership(cookbook);

    return (
      cookbook.ownerId === user?.id ||
      membership?.role === 'CREATOR' ||
      membership?.role === 'EDITOR'
    );
  }

  function canRemoveRecipe(
    cookbook: Cookbook,
    recipe: CookbookRecipe,
  ) {
    const membership = currentMembership(cookbook);

    return (
      cookbook.ownerId === user?.id ||
      recipe.userId === user?.id ||
      membership?.role === 'CREATOR' ||
      membership?.role === 'EDITOR'
    );
  }

  return (
    <Card title="Cookbooks partagés">
      <ConfirmDialog />

      <Toolbar
        className="mb-3"
        start={() => (
          <Button
            label="Nouveau cookbook"
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </span>
        )}
      />

      <DataTable
        value={filteredCookbooks}
        paginator
        rows={10}
        stripedRows
        showGridlines
        loading={loading}
        emptyMessage="Aucun cookbook."
        responsiveLayout="scroll"
      >
        <Column
          field="name"
          header="Nom"
          sortable
        />

        <Column
          header="Créateur"
          body={(cookbook: Cookbook) =>
            cookbook.owner?.email ?? cookbook.ownerId
          }
        />

        <Column
          header="Membres"
          body={(cookbook: Cookbook) =>
            cookbook.members.length
          }
          sortable
        />

        <Column
          header="Recettes"
          body={(cookbook: Cookbook) =>
            cookbook.recipes.length
          }
          sortable
        />

        <Column
          header="Actions"
          body={(cookbook: Cookbook) => (
            <div className="flex flex-wrap gap-2">
              <Button
                icon="pi pi-eye"
                rounded
                text
                aria-label="Voir"
                tooltip="Voir"
                tooltipOptions={{
                  position: 'top',
                }}
                onClick={() =>
                  openDetailsDialog(cookbook)
                }
              />

              {canAddRecipe(cookbook) && (
                <Button
                  icon="pi pi-book"
                  rounded
                  text
                  aria-label="Ajouter une recette"
                  tooltip="Ajouter une recette"
                  tooltipOptions={{
                    position: 'top',
                  }}
                  onClick={() =>
                    openRecipeDialog(cookbook)
                  }
                />
              )}

              {isOwner(cookbook) && (
                <>
                  <Button
                    icon="pi pi-user-plus"
                    rounded
                    text
                    aria-label="Ajouter un membre"
                    tooltip="Ajouter un membre"
                    tooltipOptions={{
                      position: 'top',
                    }}
                    onClick={() =>
                      openMemberDialog(cookbook)
                    }
                  />

                  <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    aria-label="Modifier"
                    tooltip="Modifier"
                    tooltipOptions={{
                      position: 'top',
                    }}
                    onClick={() =>
                      openEditDialog(cookbook)
                    }
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
                    onClick={() =>
                      confirmCookbookDelete(cookbook)
                    }
                  />
                </>
              )}
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={
          selectedCookbook
            ? 'Modifier le cookbook'
            : 'Nouveau cookbook'
        }
        visible={cookbookDialogVisible}
        style={{
          width: '32rem',
          maxWidth: '95vw',
        }}
        modal
        onHide={() =>
          setCookbookDialogVisible(false)
        }
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Annuler"
              severity="secondary"
              outlined
              onClick={() =>
                setCookbookDialogVisible(false)
              }
            />

            <Button
              label="Enregistrer"
              icon="pi pi-check"
              onClick={() => {
                void saveCookbook();
              }}
            />
          </div>
        }
      >
        <label
          htmlFor="cookbook-name"
          className="block mb-2"
        >
          Nom
        </label>

        <InputText
          id="cookbook-name"
          className="w-full"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
        />
      </Dialog>

      <Dialog
        header="Ajouter un membre"
        visible={memberDialogVisible}
        style={{
          width: '32rem',
          maxWidth: '95vw',
        }}
        modal
        onHide={() =>
          setMemberDialogVisible(false)
        }
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Annuler"
              severity="secondary"
              outlined
              onClick={() =>
                setMemberDialogVisible(false)
              }
            />

            <Button
              label="Ajouter"
              icon="pi pi-user-plus"
              disabled={!memberEmail.trim()}
              onClick={() => {
                void saveMember();
              }}
            />
          </div>
        }
      >
        <div className="flex flex-column gap-3">
          <div>
            <label
              htmlFor="member-email"
              className="block mb-2"
            >
              Adresse email
            </label>

            <InputText
              id="member-email"
              type="email"
              className="w-full"
              value={memberEmail}
              onChange={(event) =>
                setMemberEmail(event.target.value)
              }
            />
          </div>

          <div>
            <label
              htmlFor="member-role"
              className="block mb-2"
            >
              Rôle
            </label>

            <Dropdown
              inputId="member-role"
              className="w-full"
              value={memberRole}
              options={roleOptions}
              onChange={(event) =>
                setMemberRole(event.value)
              }
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Ajouter une recette"
        visible={recipeDialogVisible}
        style={{
          width: '32rem',
          maxWidth: '95vw',
        }}
        modal
        onHide={() =>
          setRecipeDialogVisible(false)
        }
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Annuler"
              severity="secondary"
              outlined
              onClick={() =>
                setRecipeDialogVisible(false)
              }
            />

            <Button
              label="Ajouter"
              icon="pi pi-plus"
              disabled={!selectedRecipeId}
              onClick={() => {
                void saveRecipe();
              }}
            />
          </div>
        }
      >
        {availableRecipes.length > 0 ? (
          <>
            <label
              htmlFor="cookbook-recipe"
              className="block mb-2"
            >
              Recette
            </label>

            <Dropdown
              inputId="cookbook-recipe"
              className="w-full"
              value={selectedRecipeId}
              options={availableRecipes}
              optionLabel="name"
              optionValue="id"
              placeholder="Sélectionner une recette"
              filter
              filterBy="name"
              onChange={(event) =>
                setSelectedRecipeId(event.value)
              }
            />
          </>
        ) : (
          <p className="m-0 text-600">
            Aucune recette personnelle disponible à ajouter.
          </p>
        )}
      </Dialog>

      <Dialog
        header={selectedCookbook?.name ?? 'Cookbook'}
        visible={detailsDialogVisible}
        style={{
          width: '55rem',
          maxWidth: '95vw',
        }}
        modal
        onHide={() =>
          setDetailsDialogVisible(false)
        }
      >
        {selectedCookbook && (
          <div className="flex flex-column gap-4">
            <section>
              <h3>Membres</h3>

              <DataTable
                value={selectedCookbook.members}
                emptyMessage="Aucun membre."
                stripedRows
              >
                <Column
                  header="Utilisateur"
                  body={(member: CookbookMember) =>
                    member.user?.email ??
                    member.userId
                  }
                />

                <Column
                  header="Rôle"
                  body={(member: CookbookMember) => (
                    <Tag
                      value={
                        roleLabels[member.role]
                      }
                    />
                  )}
                />

                {isOwner(selectedCookbook) && (
                  <Column
                    header="Actions"
                    body={(member: CookbookMember) =>
                      member.role !== 'CREATOR' ? (
                        <Button
                          icon="pi pi-trash"
                          severity="danger"
                          rounded
                          text
                          tooltip="Retirer ce membre"
                          tooltipOptions={{
                            position: 'top',
                          }}
                          onClick={() =>
                            confirmMemberDelete(
                              selectedCookbook,
                              member,
                            )
                          }
                        />
                      ) : null
                    }
                  />
                )}
              </DataTable>
            </section>

            <section>
              <div className="flex align-items-center justify-content-between gap-3 mb-3">
                <h3 className="m-0">
                  Recettes
                </h3>

                {canAddRecipe(selectedCookbook) && (
                  <Button
                    label="Ajouter une recette"
                    icon="pi pi-plus"
                    size="small"
                    onClick={() =>
                      openRecipeDialog(
                        selectedCookbook,
                      )
                    }
                  />
                )}
              </div>

              <DataTable
                value={selectedCookbook.recipes}
                emptyMessage="Aucune recette dans ce cookbook."
                stripedRows
              >
                <Column
                  field="name"
                  header="Nom"
                />

                <Column
                  field="description"
                  header="Description"
                  body={(recipe: CookbookRecipe) =>
                    recipe.description || '-'
                  }
                />

                <Column
                  header="Actions"
                  body={(recipe: CookbookRecipe) =>
                    canRemoveRecipe(
                      selectedCookbook,
                      recipe,
                    ) ? (
                      <Button
                        icon="pi pi-times"
                        severity="danger"
                        rounded
                        text
                        aria-label="Retirer du cookbook"
                        tooltip="Retirer du cookbook"
                        tooltipOptions={{
                          position: 'top',
                        }}
                        onClick={() =>
                          confirmRecipeDelete(
                            selectedCookbook,
                            recipe,
                          )
                        }
                      />
                    ) : null
                  }
                />
              </DataTable>
            </section>
          </div>
        )}
      </Dialog>
    </Card>
  );
}

export default CookbooksPage;