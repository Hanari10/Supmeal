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
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
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
import {
  createCookbookMessage,
  deleteCookbookMessage,
  getCookbookMessages,
  updateCookbookMessage,
} from '../services/cookbookMessageService';
import {
  connectCookbookSocket,
  disconnectCookbookSocket,
} from '../services/cookbookSocketService';
import { getRecipe, getRecipes } from '../services/recipeService';
import { getRecipeIngredients } from '../services/recipeIngredientService';
import {
  createRecipeComment,
  deleteRecipeComment,
  getRecipeComments,
  updateRecipeComment,
} from '../services/recipeCommentService';
import type {
  Cookbook,
  CookbookMember,
  CookbookRecipe,
  CookbookRole,
} from '../types/cookbook';
import type { Recipe } from '../types/recipe';
import type { RecipeComment } from '../types/recipeComment';
import type { CookbookMessage } from '../types/cookbookMessage';
import type { RecipeIngredient } from '../types/recipeIngredient';

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

  const [previewDialogVisible, setPreviewDialogVisible] =
    useState(false);
  const [previewRecipe, setPreviewRecipe] =
    useState<Recipe | null>(null);
  const [previewIngredients, setPreviewIngredients] =
    useState<RecipeIngredient[]>([]);
  const [previewComments, setPreviewComments] =
    useState<RecipeComment[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] =
    useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const [messages, setMessages] = useState<CookbookMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [editingMessageId, setEditingMessageId] =
    useState<string | null>(null);
  const [editingMessageContent, setEditingMessageContent] = useState('');
  const [messageSaving, setMessageSaving] = useState(false);

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

  useEffect(() => {
    if (!detailsDialogVisible || !selectedCookbook) return;

    const cookbookId = selectedCookbook.id;
    const socket = connectCookbookSocket();

    const handleCreated = (message: CookbookMessage) => {
      if (message.cookbookId !== cookbookId) return;
      setMessages((current) =>
        current.some((item) => item.id === message.id)
          ? current
          : [...current, message],
      );
    };

    const handleUpdated = (message: CookbookMessage) => {
      if (message.cookbookId !== cookbookId) return;
      setMessages((current) =>
        current.map((item) => (item.id === message.id ? message : item)),
      );
    };

    const handleDeleted = (payload: { id: string; cookbookId: string }) => {
      if (payload.cookbookId !== cookbookId) return;
      setMessages((current) =>
        current.filter((item) => item.id !== payload.id),
      );
    };

    const joinCookbook = () => {
      socket.emit('joinCookbook', { cookbookId });
    };

    socket.on('cookbookMessageCreated', handleCreated);
    socket.on('cookbookMessageUpdated', handleUpdated);
    socket.on('cookbookMessageDeleted', handleDeleted);
    socket.on('connect', joinCookbook);

    if (socket.connected) joinCookbook();

    return () => {
      socket.emit('leaveCookbook', { cookbookId });
      socket.off('connect', joinCookbook);
      socket.off('cookbookMessageCreated', handleCreated);
      socket.off('cookbookMessageUpdated', handleUpdated);
      socket.off('cookbookMessageDeleted', handleDeleted);
    };
  }, [detailsDialogVisible, selectedCookbook]);

  useEffect(() => {
    return () => {
      disconnectCookbookSocket();
    };
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

  async function loadDiscussion(cookbookId: string) {
    try {
      setMessagesLoading(true);

      const data = await getCookbookMessages(cookbookId);
      setMessages(data);
    } catch {
      showError(
        'Chargement impossible',
        'La discussion du cookbook n’a pas pu être chargée.',
      );
    } finally {
      setMessagesLoading(false);
    }
  }

  function resetDiscussionState() {
    setMessages([]);
    setMessageContent('');
    setEditingMessageId(null);
    setEditingMessageContent('');
  }

  function openDetailsDialog(cookbook: Cookbook) {
    setSelectedCookbook(cookbook);
    resetDiscussionState();
    setDetailsDialogVisible(true);
    void loadDiscussion(cookbook.id);
  }

  function closeDetailsDialog() {
    setDetailsDialogVisible(false);
    resetDiscussionState();
  }

  function openRecipeDialog(cookbook: Cookbook) {
    setSelectedCookbook(cookbook);
    setSelectedRecipeId(null);
    setRecipeDialogVisible(true);
  }

  async function openRecipePreview(recipeId: string) {
    try {
      setPreviewLoading(true);
      setPreviewDialogVisible(true);
      setPreviewRecipe(null);
      setPreviewIngredients([]);
      setPreviewComments([]);
      setCommentContent('');
      setEditingCommentId(null);
      setEditingContent('');

      const [recipeData, ingredientData, commentData] = await Promise.all([
        getRecipe(recipeId),
        getRecipeIngredients(recipeId),
        getRecipeComments(recipeId),
      ]);

      setPreviewRecipe(recipeData);
      setPreviewIngredients(ingredientData);
      setPreviewComments(commentData);
    } catch {
      setPreviewDialogVisible(false);
      showError(
        'Chargement impossible',
        'La recette partagée n’a pas pu être récupérée.',
      );
    } finally {
      setPreviewLoading(false);
    }
  }

  function closeRecipePreview() {
    setPreviewDialogVisible(false);
    setPreviewRecipe(null);
    setPreviewIngredients([]);
    setPreviewComments([]);
    setCommentContent('');
    setEditingCommentId(null);
    setEditingContent('');
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

  function canComment(cookbook: Cookbook) {
    const membership = currentMembership(cookbook);

    return (
      membership?.role === 'CREATOR' ||
      membership?.role === 'EDITOR' ||
      membership?.role === 'COMMENTER'
    );
  }

  async function createComment() {
    if (!previewRecipe || !commentContent.trim()) {
      return;
    }

    try {
      setCommentLoading(true);

      const comment = await createRecipeComment(previewRecipe.id, {
        content: commentContent.trim(),
      });

      setPreviewComments((currentComments) => [
        ...currentComments,
        comment,
      ]);
      setCommentContent('');

      showSuccess(
        'Commentaire ajouté',
        'Votre commentaire a été publié.',
      );
    } catch {
      showError(
        'Ajout impossible',
        'Le commentaire n’a pas pu être publié.',
      );
    } finally {
      setCommentLoading(false);
    }
  }

  function startEditingComment(comment: RecipeComment) {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  }

  function cancelEditingComment() {
    setEditingCommentId(null);
    setEditingContent('');
  }

  async function saveEditedComment(commentId: string) {
    if (!previewRecipe || !editingContent.trim()) {
      return;
    }

    try {
      setCommentLoading(true);

      const updatedComment = await updateRecipeComment(
        previewRecipe.id,
        commentId,
        { content: editingContent.trim() },
      );

      setPreviewComments((currentComments) =>
        currentComments.map((comment) =>
          comment.id === commentId ? updatedComment : comment,
        ),
      );

      setEditingCommentId(null);
      setEditingContent('');

      showSuccess(
        'Commentaire modifié',
        'Votre commentaire a été mis à jour.',
      );
    } catch {
      showError(
        'Modification impossible',
        'Le commentaire n’a pas pu être modifié.',
      );
    } finally {
      setCommentLoading(false);
    }
  }

  function confirmCommentDelete(comment: RecipeComment) {
    if (!previewRecipe) {
      return;
    }

    confirmDialog({
      message: 'Supprimer ce commentaire ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await deleteRecipeComment(previewRecipe.id, comment.id);

          setPreviewComments((currentComments) =>
            currentComments.filter(
              (currentComment) => currentComment.id !== comment.id,
            ),
          );

          showSuccess(
            'Commentaire supprimé',
            'Le commentaire a été supprimé.',
          );
        } catch {
          showError(
            'Suppression impossible',
            'Le commentaire n’a pas pu être supprimé.',
          );
        }
      },
    });
  }

  function getCommentAuthor(comment: RecipeComment) {
    const fullName = [
      comment.user.firstName,
      comment.user.lastName,
    ]
      .filter(Boolean)
      .join(' ');

    return fullName || comment.user.email;
  }

  function formatCommentDate(value: string) {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  async function createMessage() {
    if (!selectedCookbook || !messageContent.trim()) {
      return;
    }

    try {
      setMessageSaving(true);

      const message = await createCookbookMessage(
        selectedCookbook.id,
        {
          content: messageContent.trim(),
        },
      );

      setMessages((currentMessages) => [
        ...currentMessages,
        message,
      ]);
      setMessageContent('');

      showSuccess(
        'Message envoyé',
        'Votre message a été publié dans la discussion.',
      );
    } catch {
      showError(
        'Envoi impossible',
        'Le message n’a pas pu être envoyé.',
      );
    } finally {
      setMessageSaving(false);
    }
  }

  function startEditingMessage(message: CookbookMessage) {
    setEditingMessageId(message.id);
    setEditingMessageContent(message.content);
  }

  function cancelEditingMessage() {
    setEditingMessageId(null);
    setEditingMessageContent('');
  }

  async function saveEditedMessage(messageId: string) {
    if (!selectedCookbook || !editingMessageContent.trim()) {
      return;
    }

    try {
      setMessageSaving(true);

      const updatedMessage = await updateCookbookMessage(
        selectedCookbook.id,
        messageId,
        {
          content: editingMessageContent.trim(),
        },
      );

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === messageId
            ? updatedMessage
            : message,
        ),
      );

      setEditingMessageId(null);
      setEditingMessageContent('');

      showSuccess(
        'Message modifié',
        'Votre message a été mis à jour.',
      );
    } catch {
      showError(
        'Modification impossible',
        'Le message n’a pas pu être modifié.',
      );
    } finally {
      setMessageSaving(false);
    }
  }

  function confirmMessageDelete(message: CookbookMessage) {
    if (!selectedCookbook) {
      return;
    }

    confirmDialog({
      message: 'Supprimer ce message ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await deleteCookbookMessage(
            selectedCookbook.id,
            message.id,
          );

          setMessages((currentMessages) =>
            currentMessages.filter(
              (currentMessage) =>
                currentMessage.id !== message.id,
            ),
          );

          showSuccess(
            'Message supprimé',
            'Le message a été supprimé.',
          );
        } catch {
          showError(
            'Suppression impossible',
            'Le message n’a pas pu être supprimé.',
          );
        }
      },
    });
  }

  function getMessageAuthor(message: CookbookMessage) {
    const fullName = [
      message.user.firstName,
      message.user.lastName,
    ]
      .filter(Boolean)
      .join(' ');

    return fullName || message.user.email;
  }

  function formatMessageDate(value: string) {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
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

  function canEditCookbook(cookbook: Cookbook) {
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

              {canEditCookbook(cookbook) && (
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
        onHide={closeDetailsDialog}
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
                responsiveLayout="scroll"
              >
                <Column
                  field="name"
                  header="Nom"
                />

                <Column
                  field="description"
                  header="Description"
                  body={(recipe: Cookbook['recipes'][number]) =>
                    recipe.description || '-'
                  }
                />

                <Column
                  header="Actions"
                  body={(recipe: CookbookRecipe) => (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        icon="pi pi-eye"
                        rounded
                        text
                        tooltip="Aperçu et commentaires"
                        tooltipOptions={{
                          position: 'top',
                        }}
                        aria-label="Aperçu et commentaires"
                        onClick={() => {
                          void openRecipePreview(recipe.id);
                        }}
                      />

                      {canRemoveRecipe(
                        selectedCookbook,
                        recipe,
                      ) && (
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
                      )}
                    </div>
                  )}
                />
              </DataTable>
            </section>

            <Divider />

            <section>
              <div className="flex align-items-center justify-content-between gap-3 mb-3">
                <div>
                  <h3 className="m-0">Discussion</h3>
                  <small className="text-600">
                    Messagerie commune aux membres de ce cookbook.
                  </small>
                </div>

                <Button
                  type="button"
                  icon="pi pi-refresh"
                  rounded
                  text
                  severity="secondary"
                  tooltip="Actualiser la discussion"
                  tooltipOptions={{
                    position: 'top',
                  }}
                  aria-label="Actualiser la discussion"
                  loading={messagesLoading}
                  onClick={() => {
                    void loadDiscussion(selectedCookbook.id);
                  }}
                />
              </div>

              {messagesLoading && messages.length === 0 ? (
                <div className="flex justify-content-center p-4">
                  <ProgressSpinner
                    style={{
                      width: '36px',
                      height: '36px',
                    }}
                  />
                </div>
              ) : messages.length === 0 ? (
                <div className="surface-50 border-1 surface-border border-round p-4 text-center text-600">
                  Aucun message pour le moment. Lancez la discussion.
                </div>
              ) : (
                <div
                  className="flex flex-column gap-3 mb-4"
                  style={{
                    maxHeight: '28rem',
                    overflowY: 'auto',
                  }}
                >
                  {messages.map((message) => {
                    const isAuthor =
                      message.userId === user?.id;
                    const canDelete =
                      isAuthor ||
                      selectedCookbook.ownerId === user?.id;
                    const isEditing =
                      editingMessageId === message.id;

                    return (
                      <div
                        key={message.id}
                        className="surface-50 border-1 surface-border border-round p-3"
                      >
                        <div className="flex justify-content-between align-items-start gap-3 mb-2">
                          <div>
                            <strong>
                              {getMessageAuthor(message)}
                            </strong>

                            <div className="text-sm text-500 mt-1">
                              {formatMessageDate(
                                message.createdAt,
                              )}
                              {message.updatedAt !==
                                message.createdAt &&
                                ' · modifié'}
                            </div>
                          </div>

                          <div className="flex gap-1">
                            {isAuthor && !isEditing && (
                              <Button
                                type="button"
                                icon="pi pi-pencil"
                                rounded
                                text
                                severity="secondary"
                                tooltip="Modifier"
                                tooltipOptions={{
                                  position: 'top',
                                }}
                                aria-label="Modifier le message"
                                onClick={() =>
                                  startEditingMessage(message)
                                }
                              />
                            )}

                            {canDelete && (
                              <Button
                                type="button"
                                icon="pi pi-trash"
                                rounded
                                text
                                severity="danger"
                                tooltip="Supprimer"
                                tooltipOptions={{
                                  position: 'top',
                                }}
                                aria-label="Supprimer le message"
                                onClick={() =>
                                  confirmMessageDelete(message)
                                }
                              />
                            )}
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="flex flex-column gap-2">
                            <InputTextarea
                              value={editingMessageContent}
                              rows={3}
                              maxLength={2000}
                              autoResize
                              className="w-full"
                              onChange={(event) =>
                                setEditingMessageContent(
                                  event.target.value,
                                )
                              }
                            />

                            <div className="flex justify-content-between align-items-center gap-2">
                              <small className="text-500">
                                {editingMessageContent.length}/2000 caractères
                              </small>

                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  label="Annuler"
                                  severity="secondary"
                                  outlined
                                  onClick={cancelEditingMessage}
                                />

                                <Button
                                  type="button"
                                  label="Enregistrer"
                                  icon="pi pi-check"
                                  loading={messageSaving}
                                  disabled={
                                    !editingMessageContent.trim()
                                  }
                                  onClick={() => {
                                    void saveEditedMessage(
                                      message.id,
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.6,
                            }}
                          >
                            {message.content}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-column gap-2">
                <label
                  htmlFor="cookbook-message"
                  className="font-medium"
                >
                  Écrire un message
                </label>

                <InputTextarea
                  id="cookbook-message"
                  value={messageContent}
                  rows={4}
                  maxLength={2000}
                  autoResize
                  className="w-full"
                  placeholder="Écrivez un message aux membres du cookbook..."
                  onChange={(event) =>
                    setMessageContent(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' &&
                      !event.shiftKey
                    ) {
                      event.preventDefault();

                      if (
                        messageContent.trim() &&
                        !messageSaving
                      ) {
                        void createMessage();
                      }
                    }
                  }}
                />

                <div className="flex justify-content-between align-items-center gap-2">
                  <small className="text-500">
                    {messageContent.length}/2000 caractères
                    {' · '}
                    Entrée pour envoyer, Maj + Entrée pour une nouvelle ligne
                  </small>

                  <Button
                    type="button"
                    label="Envoyer"
                    icon="pi pi-send"
                    loading={messageSaving}
                    disabled={!messageContent.trim()}
                    onClick={() => {
                      void createMessage();
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </Dialog>

      <Dialog
        header={previewRecipe?.name ?? 'Aperçu de la recette'}
        visible={previewDialogVisible}
        style={{
          width: '70rem',
          maxWidth: '96vw',
        }}
        modal
        onHide={closeRecipePreview}
      >
        {previewLoading ? (
          <div className="flex justify-content-center p-6">
            <ProgressSpinner />
          </div>
        ) : previewRecipe && selectedCookbook ? (
          <div className="flex flex-column gap-4">
            <div className="grid">
              {previewRecipe.imageUrl && (
                <div className="col-12 lg:col-5">
                  <img
                    src={previewRecipe.imageUrl}
                    alt={previewRecipe.name}
                    style={{
                      width: '100%',
                      maxHeight: '360px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                    }}
                  />
                </div>
              )}

              <div
                className={
                  previewRecipe.imageUrl
                    ? 'col-12 lg:col-7'
                    : 'col-12'
                }
              >
                <p className="text-600 text-lg mt-0">
                  {previewRecipe.description ||
                    'Aucune description.'}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Tag
                    icon="pi pi-users"
                    value={`${previewRecipe.servings ?? '-'} portion(s)`}
                    severity="info"
                  />
                  <Tag
                    icon="pi pi-clock"
                    value={`Préparation : ${
                      previewRecipe.preparationTime
                        ? `${previewRecipe.preparationTime} min`
                        : '-'
                    }`}
                    severity="success"
                  />
                  <Tag
                    icon="pi pi-stopwatch"
                    value={`Cuisson : ${
                      previewRecipe.cookingTime
                        ? `${previewRecipe.cookingTime} min`
                        : '-'
                    }`}
                    severity="warning"
                  />
                  <Tag
                    icon="pi pi-chart-bar"
                    value={`Difficulté : ${
                      previewRecipe.difficulty || '-'
                    }`}
                    severity="secondary"
                  />
                </div>

                {previewRecipe.tags &&
                  previewRecipe.tags.length > 0 && (
                    <div className="mb-3">
                      <h4 className="mt-0 mb-2">
                        Catégories / Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {previewRecipe.tags.map((recipeTag) => (
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

                {previewRecipe.sourceUrl && (
                  <div>
                    <h4 className="mt-0 mb-2">Source</h4>
                    <a
                      href={previewRecipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                    >
                      {previewRecipe.sourceUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <Divider />

            <section>
              <h3>Ingrédients</h3>
              <DataTable
                value={previewIngredients}
                stripedRows
                showGridlines
                emptyMessage="Aucun ingrédient renseigné."
                responsiveLayout="scroll"
              >
                <Column
                  header="Ingrédient"
                  body={(recipeIngredient: RecipeIngredient) =>
                    recipeIngredient.ingredient.name
                  }
                />
                <Column
                  header="Quantité"
                  body={(recipeIngredient: RecipeIngredient) =>
                    recipeIngredient.quantity
                  }
                />
                <Column
                  header="Unité"
                  body={(recipeIngredient: RecipeIngredient) =>
                    recipeIngredient.unit ||
                    recipeIngredient.ingredient
                      .defaultMeasurementUnit ||
                    '-'
                  }
                />
              </DataTable>
            </section>

            <section>
              <h3>Instructions</h3>
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.7,
                }}
              >
                {previewRecipe.instructions}
              </div>
            </section>

            <Divider />

            <section>
              <h3>Commentaires</h3>

              {previewComments.length === 0 ? (
                <p className="text-600">
                  Aucun commentaire pour cette recette.
                </p>
              ) : (
                <div className="flex flex-column gap-3">
                  {previewComments.map((comment) => {
                    const isAuthor = comment.userId === user?.id;
                    const canDelete =
                      isAuthor || selectedCookbook.ownerId === user?.id;
                    const isEditing = editingCommentId === comment.id;

                    return (
                      <div
                        key={comment.id}
                        className="surface-50 border-1 surface-border border-round p-3"
                      >
                        <div className="flex justify-content-between align-items-start gap-3 mb-2">
                          <div>
                            <strong>{getCommentAuthor(comment)}</strong>
                            <div className="text-sm text-500 mt-1">
                              {formatCommentDate(comment.createdAt)}
                              {comment.updatedAt !== comment.createdAt &&
                                ' · modifié'}
                            </div>
                          </div>

                          <div className="flex gap-1">
                            {isAuthor && !isEditing && (
                              <Button
                                type="button"
                                icon="pi pi-pencil"
                                rounded
                                text
                                severity="secondary"
                                tooltip="Modifier"
                                tooltipOptions={{ position: 'top' }}
                                onClick={() =>
                                  startEditingComment(comment)
                                }
                              />
                            )}

                            {canDelete && (
                              <Button
                                type="button"
                                icon="pi pi-trash"
                                rounded
                                text
                                severity="danger"
                                tooltip="Supprimer"
                                tooltipOptions={{ position: 'top' }}
                                onClick={() =>
                                  confirmCommentDelete(comment)
                                }
                              />
                            )}
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="flex flex-column gap-2">
                            <InputTextarea
                              value={editingContent}
                              rows={3}
                              maxLength={2000}
                              autoResize
                              className="w-full"
                              onChange={(event) =>
                                setEditingContent(event.target.value)
                              }
                            />

                            <div className="flex justify-content-end gap-2">
                              <Button
                                type="button"
                                label="Annuler"
                                severity="secondary"
                                outlined
                                onClick={cancelEditingComment}
                              />
                              <Button
                                type="button"
                                label="Enregistrer"
                                icon="pi pi-check"
                                loading={commentLoading}
                                disabled={!editingContent.trim()}
                                onClick={() => {
                                  void saveEditedComment(comment.id);
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.6,
                            }}
                          >
                            {comment.content}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <Divider />

              {canComment(selectedCookbook) ? (
                <div className="flex flex-column gap-2">
                  <label
                    htmlFor="cookbook-recipe-comment"
                    className="font-medium"
                  >
                    Ajouter un commentaire
                  </label>
                  <InputTextarea
                    id="cookbook-recipe-comment"
                    value={commentContent}
                    rows={4}
                    maxLength={2000}
                    autoResize
                    className="w-full"
                    placeholder="Partagez un conseil, une modification ou une suggestion..."
                    onChange={(event) =>
                      setCommentContent(event.target.value)
                    }
                  />
                  <div className="flex justify-content-between align-items-center gap-2">
                    <small className="text-500">
                      {commentContent.length}/2000 caractères
                    </small>
                    <Button
                      type="button"
                      label="Publier"
                      icon="pi pi-send"
                      loading={commentLoading}
                      disabled={!commentContent.trim()}
                      onClick={() => {
                        void createComment();
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex align-items-center gap-2 text-600">
                  <i className="pi pi-eye" />
                  <span>
                    Votre rôle permet de consulter les commentaires, mais pas d’en publier.
                  </span>
                </div>
              )}
            </section>
          </div>
        ) : null}
      </Dialog>
    </Card>
  );
}

export default CookbooksPage;