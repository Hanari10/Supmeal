import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import type { FileUploadSelectEvent } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toolbar } from 'primereact/toolbar';

import { getIngredients } from '../services/ingredientService';
import {
  getRecipe,
  updateRecipe,
  uploadRecipeImage,
} from '../services/recipeService';
import {
  addRecipeIngredient,
  deleteRecipeIngredient,
  getRecipeIngredients,
  updateRecipeIngredient,
} from '../services/recipeIngredientService';

import { useToast } from '../hooks/useToast';

import type { Ingredient } from '../types/ingredient';
import type { RecipeIngredient } from '../types/recipeIngredient';

const difficultyOptions = [
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

interface IngredientRow {
  key: string;
  ingredientId: string;
  quantity: number;
  unit: string;
}

function createIngredientRow(): IngredientRow {
  return {
    key: crypto.randomUUID(),
    ingredientId: '',
    quantity: 1,
    unit: '',
  };
}

function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const [loading, setLoading] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');

  const [preparationTime, setPreparationTime] =
    useState<number>(0);
  const [cookingTime, setCookingTime] =
    useState<number>(0);
  const [servings, setServings] =
    useState<number>(1);

  const [difficulty, setDifficulty] = useState('');

  const [ingredients, setIngredients] =
    useState<Ingredient[]>([]);

  const [ingredientRows, setIngredientRows] =
    useState<IngredientRow[]>([]);

  const [
    originalRecipeIngredients,
    setOriginalRecipeIngredients,
  ] = useState<RecipeIngredient[]>([]);

  const [currentImageUrl, setCurrentImageUrl] =
    useState('');

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreviewUrl, setImagePreviewUrl] =
    useState('');

  const [removeCurrentImage, setRemoveCurrentImage] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (!id) {
      return;
    }

    Promise.all([
      getRecipe(id),
      getIngredients(),
      getRecipeIngredients(id),
    ])
      .then(
        ([
          recipe,
          availableIngredients,
          recipeIngredients,
        ]) => {
          if (isCancelled) {
            return;
          }

          setName(recipe.name);
          setDescription(recipe.description ?? '');
          setInstructions(recipe.instructions);

          setPreparationTime(
            recipe.preparationTime ?? 0,
          );

          setCookingTime(
            recipe.cookingTime ?? 0,
          );

          setServings(recipe.servings ?? 1);
          setDifficulty(recipe.difficulty ?? '');

          setCurrentImageUrl(recipe.imageUrl ?? '');
          setSelectedImage(null);
          setImagePreviewUrl('');
          setRemoveCurrentImage(false);

          setIngredients(availableIngredients);

          setOriginalRecipeIngredients(
            recipeIngredients,
          );

          setIngredientRows(
            recipeIngredients.map(
              (recipeIngredient) => ({
                key: crypto.randomUUID(),

                ingredientId:
                  recipeIngredient.ingredientId,

                quantity:
                  recipeIngredient.quantity,

                unit:
                  recipeIngredient.unit ??
                  recipeIngredient.ingredient
                    .defaultMeasurementUnit ??
                  '',
              }),
            ),
          );
        },
      )
      .catch(() => {
        if (!isCancelled) {
          showError(
            'Chargement impossible',
            'La recette ou ses ingrédients n’ont pas pu être récupérés.',
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

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  function handleImageSelect(
    event: FileUploadSelectEvent,
  ) {
    const file = event.files[0];

    if (!file) {
      return;
    }

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedImage(file);
    setImagePreviewUrl(
      URL.createObjectURL(file),
    );
    setRemoveCurrentImage(false);
  }

  function clearSelectedImage() {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedImage(null);
    setImagePreviewUrl('');
  }

  function removeImage() {
    clearSelectedImage();
    setRemoveCurrentImage(true);
  }

  function addIngredientRow() {
    setIngredientRows((currentRows) => [
      ...currentRows,
      createIngredientRow(),
    ]);
  }

  function removeIngredientRow(key: string) {
    setIngredientRows((currentRows) =>
      currentRows.filter(
        (row) => row.key !== key,
      ),
    );
  }

  function updateIngredientId(
    key: string,
    ingredientId: string,
  ) {
    const selectedIngredient = ingredients.find(
      (ingredient) =>
        ingredient.id === ingredientId,
    );

    setIngredientRows((currentRows) =>
      currentRows.map((row) =>
        row.key === key
          ? {
              ...row,
              ingredientId,
              unit:
                selectedIngredient
                  ?.defaultMeasurementUnit ??
                '',
            }
          : row,
      ),
    );
  }

  function updateIngredientQuantity(
    key: string,
    quantity: number,
  ) {
    setIngredientRows((currentRows) =>
      currentRows.map((row) =>
        row.key === key
          ? {
              ...row,
              quantity,
            }
          : row,
      ),
    );
  }

  function updateIngredientUnit(
    key: string,
    unit: string,
  ) {
    setIngredientRows((currentRows) =>
      currentRows.map((row) =>
        row.key === key
          ? {
              ...row,
              unit,
            }
          : row,
      ),
    );
  }

  async function synchronizeIngredients(
    recipeId: string,
  ) {
    const currentIngredientIds = new Set(
      ingredientRows.map(
        (row) => row.ingredientId,
      ),
    );

    /*
     * Supprime les ingrédients qui étaient présents
     * auparavant mais qui ne sont plus dans le formulaire.
     */
    for (const existingIngredient of originalRecipeIngredients) {
      if (
        !currentIngredientIds.has(
          existingIngredient.ingredientId,
        )
      ) {
        await deleteRecipeIngredient(
          recipeId,
          existingIngredient.ingredientId,
        );
      }
    }

    const originalIngredientIds = new Set(
      originalRecipeIngredients.map(
        (recipeIngredient) =>
          recipeIngredient.ingredientId,
      ),
    );

    /*
     * Ajoute les nouveaux ingrédients ou met à jour
     * ceux qui existaient déjà.
     */
    for (const [index, row] of ingredientRows.entries()) {
      const data = {
        quantity: row.quantity,
        unit: row.unit.trim() || undefined,
        order: index,
      };

      if (
        originalIngredientIds.has(
          row.ingredientId,
        )
      ) {
        await updateRecipeIngredient(
          recipeId,
          row.ingredientId,
          data,
        );
      } else {
        await addRecipeIngredient(
          recipeId,
          {
            ingredientId: row.ingredientId,
            ...data,
          },
        );
      }
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!id) {
      showError(
        'Recette introuvable',
        'Aucun identifiant de recette n’a été fourni.',
      );

      return;
    }

    const trimmedName = name.trim();

    const trimmedInstructions =
      instructions.trim();

    if (!trimmedName) {
      showError(
        'Champ obligatoire',
        'Le nom de la recette est obligatoire.',
      );

      return;
    }

    if (!trimmedInstructions) {
      showError(
        'Champ obligatoire',
        'Les instructions sont obligatoires.',
      );

      return;
    }

    if (servings < 1) {
      showError(
        'Portions invalides',
        'Le nombre de portions doit être supérieur à zéro.',
      );

      return;
    }

    const incompleteIngredient =
      ingredientRows.some(
        (row) =>
          !row.ingredientId ||
          row.quantity <= 0,
      );

    if (incompleteIngredient) {
      showError(
        'Ingrédient incomplet',
        'Chaque ingrédient doit avoir un nom et une quantité valide.',
      );

      return;
    }

    const ingredientIds =
      ingredientRows.map(
        (row) => row.ingredientId,
      );

    const hasDuplicates =
      new Set(ingredientIds).size !==
      ingredientIds.length;

    if (hasDuplicates) {
      showError(
        'Ingrédient en double',
        'Un même ingrédient ne peut apparaître qu’une seule fois dans la recette.',
      );

      return;
    }

    try {
      setIsSubmitting(true);

      let finalImageUrl:
        | string
        | undefined
        | null;

      if (selectedImage) {
        setUploadingImage(true);

        const uploadResult =
          await uploadRecipeImage(
            selectedImage,
          );

        finalImageUrl =
          uploadResult.imageUrl;
      } else if (removeCurrentImage) {
        finalImageUrl = null;
      } else {
        finalImageUrl =
          currentImageUrl || undefined;
      }

      await updateRecipe(id, {
        name: trimmedName,

        description:
          description.trim() || undefined,

        instructions:
          trimmedInstructions,

        preparationTime:
          preparationTime > 0
            ? preparationTime
            : undefined,

        cookingTime:
          cookingTime > 0
            ? cookingTime
            : undefined,

        servings,

        difficulty:
          difficulty || undefined,

        imageUrl: finalImageUrl,
      });

      await synchronizeIngredients(id);

      showSuccess(
        'Recette modifiée',
        `Les modifications de « ${trimmedName} » ont été enregistrées.`,
      );

      navigate(`/recettes/${id}`);
    } catch {
      showError(
        'Modification impossible',
        'La recette ou ses ingrédients n’ont pas pu être modifiés.',
      );
    } finally {
      setUploadingImage(false);
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-content-center p-6">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <Card title="Modifier la recette">
      <Toolbar
        className="mb-4"
        start={() => (
          <Button
            label="Retour"
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
            onClick={() =>
              navigate(
                id
                  ? `/recettes/${id}`
                  : '/recettes',
              )
            }
          />
        )}
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-column gap-4"
      >
        <div>
          <label
            htmlFor="edit-recipe-name"
            className="block mb-2"
          >
            Nom
          </label>

          <InputText
            id="edit-recipe-name"
            className="w-full"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="edit-recipe-description"
            className="block mb-2"
          >
            Description
          </label>

          <InputTextarea
            id="edit-recipe-description"
            className="w-full"
            value={description}
            rows={4}
            autoResize
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
          />
        </div>

        <div>
          <label
            htmlFor="edit-recipe-instructions"
            className="block mb-2"
          >
            Instructions
          </label>

          <InputTextarea
            id="edit-recipe-instructions"
            className="w-full"
            value={instructions}
            rows={8}
            autoResize
            onChange={(event) =>
              setInstructions(
                event.target.value,
              )
            }
            required
          />
        </div>

        <div className="grid">
          <div className="col-12 md:col-4">
            <label
              htmlFor="edit-recipe-preparation"
              className="block mb-2"
            >
              Préparation
            </label>

            <InputNumber
              inputId="edit-recipe-preparation"
              className="w-full"
              value={preparationTime}
              min={0}
              suffix=" min"
              showButtons
              onValueChange={(event) =>
                setPreparationTime(
                  event.value ?? 0,
                )
              }
            />
          </div>

          <div className="col-12 md:col-4">
            <label
              htmlFor="edit-recipe-cooking"
              className="block mb-2"
            >
              Cuisson
            </label>

            <InputNumber
              inputId="edit-recipe-cooking"
              className="w-full"
              value={cookingTime}
              min={0}
              suffix=" min"
              showButtons
              onValueChange={(event) =>
                setCookingTime(
                  event.value ?? 0,
                )
              }
            />
          </div>

          <div className="col-12 md:col-4">
            <label
              htmlFor="edit-recipe-servings"
              className="block mb-2"
            >
              Portions
            </label>

            <InputNumber
              inputId="edit-recipe-servings"
              className="w-full"
              value={servings}
              min={1}
              max={100}
              showButtons
              onValueChange={(event) =>
                setServings(
                  event.value ?? 1,
                )
              }
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="edit-recipe-difficulty"
            className="block mb-2"
          >
            Difficulté
          </label>

          <Dropdown
            inputId="edit-recipe-difficulty"
            className="w-full"
            value={difficulty}
            options={difficultyOptions}
            placeholder="Sélectionner une difficulté"
            showClear
            onChange={(event) =>
              setDifficulty(
                event.value ?? '',
              )
            }
          />
        </div>

        <Card
          title="Ingrédients"
          className="surface-50"
        >
          <div className="flex flex-column gap-3">
            {ingredientRows.length === 0 && (
              <p className="m-0 text-600">
                Aucun ingrédient ajouté.
              </p>
            )}

            {ingredientRows.map(
              (row, index) => (
                <div
                  key={row.key}
                  className="grid align-items-end"
                >
                  <div className="col-12 md:col-5">
                    <label
                      htmlFor={`edit-ingredient-${row.key}`}
                      className="block mb-2"
                    >
                      Ingrédient {index + 1}
                    </label>

                    <Dropdown
                      inputId={`edit-ingredient-${row.key}`}
                      className="w-full"
                      value={
                        row.ingredientId
                      }
                      options={ingredients}
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Sélectionner un ingrédient"
                      filter
                      onChange={(event) =>
                        updateIngredientId(
                          row.key,
                          event.value,
                        )
                      }
                    />
                  </div>

                  <div className="col-12 md:col-3">
                    <label
                      htmlFor={`edit-quantity-${row.key}`}
                      className="block mb-2"
                    >
                      Quantité
                    </label>

                    <InputNumber
                      inputId={`edit-quantity-${row.key}`}
                      className="w-full"
                      value={row.quantity}
                      min={0.01}
                      maxFractionDigits={2}
                      onValueChange={(event) =>
                        updateIngredientQuantity(
                          row.key,
                          event.value ?? 1,
                        )
                      }
                    />
                  </div>

                  <div className="col-10 md:col-3">
                    <label
                      htmlFor={`edit-unit-${row.key}`}
                      className="block mb-2"
                    >
                      Unité
                    </label>

                    <InputText
                      id={`edit-unit-${row.key}`}
                      className="w-full"
                      value={row.unit}
                      placeholder="g, kg, ml..."
                      onChange={(event) =>
                        updateIngredientUnit(
                          row.key,
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="col-2 md:col-1">
                    <Button
                      type="button"
                      icon="pi pi-trash"
                      severity="danger"
                      rounded
                      text
                      tooltip="Retirer l’ingrédient"
                      tooltipOptions={{
                        position: 'top',
                      }}
                      aria-label="Retirer l’ingrédient"
                      onClick={() =>
                        removeIngredientRow(
                          row.key,
                        )
                      }
                    />
                  </div>
                </div>
              ),
            )}

            <div>
              <Button
                type="button"
                label="Ajouter un ingrédient"
                icon="pi pi-plus"
                severity="secondary"
                outlined
                onClick={addIngredientRow}
              />
            </div>
          </div>
        </Card>

        <div>
          <label className="block mb-2">
            Image de la recette
          </label>

          <div className="flex flex-wrap align-items-center gap-2">
            <FileUpload
              mode="basic"
              name="file"
              accept="image/jpeg,image/png,image/webp"
              maxFileSize={
                5 * 1024 * 1024
              }
              chooseLabel={
                currentImageUrl ||
                selectedImage
                  ? 'Changer l’image'
                  : 'Choisir une image'
              }
              customUpload
              auto={false}
              onSelect={
                handleImageSelect
              }
            />

            {(currentImageUrl ||
              selectedImage) &&
              !removeCurrentImage && (
                <Button
                  type="button"
                  icon="pi pi-trash"
                  severity="danger"
                  rounded
                  text
                  tooltip="Retirer l’image"
                  tooltipOptions={{
                    position: 'top',
                  }}
                  aria-label="Retirer l’image"
                  onClick={removeImage}
                />
              )}
          </div>

          <small className="block mt-2 text-600">
            Formats acceptés : JPG, PNG
            et WebP. Taille maximale : 5
            Mo.
          </small>
        </div>

        {!removeCurrentImage &&
          (imagePreviewUrl ||
            currentImageUrl) && (
            <div>
              <span className="block mb-2">
                Aperçu
              </span>

              <img
                src={
                  imagePreviewUrl ||
                  currentImageUrl
                }
                alt={`Aperçu de ${name}`}
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  maxHeight: '280px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />

              {selectedImage && (
                <small className="block mt-2 text-600">
                  {selectedImage.name}
                </small>
              )}
            </div>
          )}

        <div className="flex flex-wrap justify-content-end gap-2">
          <Button
            type="button"
            label="Annuler"
            icon="pi pi-times"
            severity="secondary"
            outlined
            disabled={
              isSubmitting ||
              uploadingImage
            }
            onClick={() =>
              navigate(
                id
                  ? `/recettes/${id}`
                  : '/recettes',
              )
            }
          />

          <Button
            type="submit"
            label={
              uploadingImage
                ? 'Envoi de l’image...'
                : 'Enregistrer'
            }
            icon="pi pi-save"
            loading={
              isSubmitting ||
              uploadingImage
            }
          />
        </div>
      </form>
    </Card>
  );
}

export default EditRecipePage;