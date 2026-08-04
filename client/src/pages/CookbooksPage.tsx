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

import {
  addCookbookMember,
  createCookbook,
  deleteCookbook,
  getCookbooks,
  removeCookbookMember,
  updateCookbook,
} from '../services/cookbookService';
import { useAuth } from '../hooks/useAuth';
import type {
  Cookbook,
  CookbookMember,
  CookbookRole,
} from '../types/cookbook';

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

  const [cookbooks, setCookbooks] = useState<Cookbook[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [cookbookDialogVisible, setCookbookDialogVisible] =
    useState(false);
  const [memberDialogVisible, setMemberDialogVisible] = useState(false);
  const [detailsDialogVisible, setDetailsDialogVisible] =
    useState(false);

  const [selectedCookbook, setSelectedCookbook] =
    useState<Cookbook | null>(null);

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

  useEffect(() => {
    void loadCookbooks();
  }, []);

  const filteredCookbooks = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return cookbooks;
    }

    return cookbooks.filter((cookbook) =>
      cookbook.name.toLowerCase().includes(value),
    );
  }, [cookbooks, search]);

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

  async function saveCookbook() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    if (selectedCookbook) {
      await updateCookbook(selectedCookbook.id, {
        name: trimmedName,
      });
    } else {
      await createCookbook({
        name: trimmedName,
      });
    }

    setCookbookDialogVisible(false);
    await loadCookbooks();
  }

  async function saveMember() {
    if (!selectedCookbook || !memberEmail.trim()) {
      return;
    }

    await addCookbookMember(selectedCookbook.id, {
      email: memberEmail.trim(),
      role: memberRole,
    });

    setMemberDialogVisible(false);
    await loadCookbooks();
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
        await deleteCookbook(cookbook.id);
        await loadCookbooks();
      },
    });
  }

  function confirmMemberDelete(
    cookbook: Cookbook,
    member: CookbookMember,
  ) {
    confirmDialog({
      message: 'Supprimer ce membre du cookbook ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        await removeCookbookMember(cookbook.id, member.id);
        await loadCookbooks();

        const updatedCookbooks = await getCookbooks();
        const updatedCookbook = updatedCookbooks.find(
          (item) => item.id === cookbook.id,
        );

        setSelectedCookbook(updatedCookbook ?? null);
      },
    });
  }

  function isOwner(cookbook: Cookbook) {
    return cookbook.ownerId === user?.id;
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
              onChange={(event) => setSearch(event.target.value)}
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
        <Column field="name" header="Nom" sortable />

        <Column
          header="Créateur"
          body={(cookbook: Cookbook) =>
            cookbook.owner?.email ?? cookbook.ownerId
          }
        />

        <Column
          header="Membres"
          body={(cookbook: Cookbook) => cookbook.members.length}
          sortable
        />

        <Column
          header="Recettes"
          body={(cookbook: Cookbook) => cookbook.recipes.length}
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
                onClick={() => openDetailsDialog(cookbook)}
              />

              {isOwner(cookbook) && (
                <>
                  <Button
                    icon="pi pi-user-plus"
                    rounded
                    text
                    aria-label="Ajouter un membre"
                    onClick={() => openMemberDialog(cookbook)}
                  />

                  <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    aria-label="Modifier"
                    onClick={() => openEditDialog(cookbook)}
                  />

                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    text
                    aria-label="Supprimer"
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
        style={{ width: '32rem', maxWidth: '95vw' }}
        modal
        onHide={() => setCookbookDialogVisible(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Annuler"
              severity="secondary"
              outlined
              onClick={() => setCookbookDialogVisible(false)}
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
        <label htmlFor="cookbook-name" className="block mb-2">
          Nom
        </label>

        <InputText
          id="cookbook-name"
          className="w-full"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </Dialog>

      <Dialog
        header="Ajouter un membre"
        visible={memberDialogVisible}
        style={{ width: '32rem', maxWidth: '95vw' }}
        modal
        onHide={() => setMemberDialogVisible(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Annuler"
              severity="secondary"
              outlined
              onClick={() => setMemberDialogVisible(false)}
            />

            <Button
              label="Ajouter"
              icon="pi pi-user-plus"
              onClick={() => {
                void saveMember();
              }}
            />
          </div>
        }
      >
        <div className="flex flex-column gap-3">
          <div>
            <label htmlFor="member-email" className="block mb-2">
              Adresse email
            </label>

            <InputText
              id="member-email"
              type="email"
              className="w-full"
              value={memberEmail}
              onChange={(event) => setMemberEmail(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="member-role" className="block mb-2">
              Rôle
            </label>

            <Dropdown
              inputId="member-role"
              className="w-full"
              value={memberRole}
              options={roleOptions}
              onChange={(event) => setMemberRole(event.value)}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        header={selectedCookbook?.name ?? 'Cookbook'}
        visible={detailsDialogVisible}
        style={{ width: '55rem', maxWidth: '95vw' }}
        modal
        onHide={() => setDetailsDialogVisible(false)}
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
                    member.user?.email ?? member.userId
                  }
                />

                <Column
                  header="Rôle"
                  body={(member: CookbookMember) => (
                    <Tag value={roleLabels[member.role]} />
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
              <h3>Recettes</h3>

              <DataTable
                value={selectedCookbook.recipes}
                emptyMessage="Aucune recette dans ce cookbook."
                stripedRows
              >
                <Column field="name" header="Nom" />

                <Column
                  field="description"
                  header="Description"
                  body={(recipe: Cookbook['recipes'][number]) =>
                    recipe.description || '-'
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