import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import type { FileUploadSelectEvent } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toolbar } from 'primereact/toolbar';

import { getIngredients } from '../services/ingredientService';
import {
  createRecipe,
  uploadRecipeImage,
} from '../services/recipeService';
import { addRecipeIngredient } from '../services/recipeIngredientService';

import { useToast } from '../hooks/useToast';

import type { Ingredient } from '../types/ingredient';

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

function CreateRecipePage() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');

  const [preparationTime, setPreparationTime] =
    useState<number>(0);
  const [cookingTime, setCookingTime] =
    useState<number>(0);
  const [servings, setServings] = useState<number>(1);

  const [difficulty, setDifficulty] = useState('');

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientRows, setIngredientRows] = useState<
    IngredientRow[]
  >([]);

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] =
    useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] =
    useState(false);

  useEffect(() => {
    let isCancelled = false;

    getIngredients()
      .then((data) => {
        if (!isCancelled) {
          setIngredients(data);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          showError(
            'Chargement impossible',
            'Impossible de récupérer les ingrédients.',
          );
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [showError]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  function handleImageSelect(event: FileUploadSelectEvent) {
    const file = event.files[0];

    if (!file) {
      return;
    }

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  }

  function removeSelectedImage() {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedImage(null);
    setImagePreviewUrl('');
  }

  function addIngredientRow() {
    setIngredientRows((currentRows) => [
      ...currentRows,
      createIngredientRow(),
    ]);
  }

  function removeIngredientRow(key: string) {
    setIngredientRows((currentRows) =>
      currentRows.filter((row) => row.key !== key),
    );
  }

  function updateIngredientId(
    key: string,
    ingredientId: string,
  ) {
    const selectedIngredient = ingredients.find(
      (ingredient) => ingredient.id === ingredientId,
    );

    setIngredientRows((currentRows) =>
      currentRows.map((row) =>
        row.key === key
          ? {
              ...row,
              ingredientId,
              unit:
                selectedIngredient?.defaultMeasurementUnit ??
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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedInstructions = instructions.trim();

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

    const incompleteIngredient = ingredientRows.some(
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

    const ingredientIds = ingredientRows.map(
      (row) => row.ingredientId,
    );

    const hasDuplicates =
      new Set(ingredientIds).size !== ingredientIds.length;

    if (hasDuplicates) {
      showError(
        'Ingrédient en double',
        'Un même ingrédient ne peut apparaître qu’une seule fois dans la recette.',
      );

      return;
    }

    try {
      setIsSubmitting(true);

      let uploadedImageUrl: string | undefined;

      if (selectedImage) {
        setUploadingImage(true);

        const uploadResult =
          await uploadRecipeImage(selectedImage);

        uploadedImageUrl = uploadResult.imageUrl;
      }

      const createdRecipe = await createRecipe({
        name: trimmedName,
        description: description.trim() || undefined,
        instructions: trimmedInstructions,
        preparationTime:
          preparationTime > 0
            ? preparationTime
            : undefined,
        cookingTime:
          cookingTime > 0 ? cookingTime : undefined,
        servings,
        difficulty: difficulty || undefined,
        imageUrl: uploadedImageUrl,
      });

      for (const [index, row] of ingredientRows.entries()) {
        await addRecipeIngredient(createdRecipe.id, {
          ingredientId: row.ingredientId,
          quantity: row.quantity,
          unit: row.unit.trim() || undefined,
          order: index,
        });
      }

      showSuccess(
        'Recette créée',
        `La recette « ${trimmedName} » a été ajoutée avec ses ingrédients.`,
      );

      navigate('/recettes');
    } catch {
      showError(
        'Création impossible',
        'La recette ou ses ingrédients n’ont pas pu être enregistrés.',
      );
    } finally {
      setUploadingImage(false);
      setIsSubmitting(false);
    }
  }

  return (
    <Card title="Nouvelle recette">
      <Toolbar
        className="mb-4"
        start={() => (
          <Button
            label="Retour"
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
            onClick={() => navigate('/recettes')}
          />
        )}
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-column gap-4"
      >
        <div>
          <label
            htmlFor="recipe-name"
            className="block mb-2"
          >
            Nom
          </label>

          <InputText
            id="recipe-name"
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
            htmlFor="recipe-description"
            className="block mb-2"
          >
            Description
          </label>

          <InputTextarea
            id="recipe-description"
            className="w-full"
            value={description}
            rows={4}
            autoResize
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        <div>
          <label
            htmlFor="recipe-instructions"
            className="block mb-2"
          >
            Instructions
          </label>

          <InputTextarea
            id="recipe-instructions"
            className="w-full"
            value={instructions}
            rows={8}
            autoResize
            onChange={(event) =>
              setInstructions(event.target.value)
            }
            required
          />
        </div>

        <div className="grid">
          <div className="col-12 md:col-4">
            <label
              htmlFor="recipe-preparation-time"
              className="block mb-2"
            >
              Préparation
            </label>

            <InputNumber
              inputId="recipe-preparation-time"
              className="w-full"
              value={preparationTime}
              min={0}
              suffix=" min"
              showButtons
              onValueChange={(event) =>
                setPreparationTime(event.value ?? 0)
              }
            />
          </div>

          <div className="col-12 md:col-4">
            <label
              htmlFor="recipe-cooking-time"
              className="block mb-2"
            >
              Cuisson
            </label>

            <InputNumber
              inputId="recipe-cooking-time"
              className="w-full"
              value={cookingTime}
              min={0}
              suffix=" min"
              showButtons
              onValueChange={(event) =>
                setCookingTime(event.value ?? 0)
              }
            />
          </div>

          <div className="col-12 md:col-4">
            <label
              htmlFor="recipe-servings"
              className="block mb-2"
            >
              Portions
            </label>

            <InputNumber
              inputId="recipe-servings"
              className="w-full"
              value={servings}
              min={1}
              max={100}
              showButtons
              onValueChange={(event) =>
                setServings(event.value ?? 1)
              }
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="recipe-difficulty"
            className="block mb-2"
          >
            Difficulté
          </label>

          <Dropdown
            inputId="recipe-difficulty"
            className="w-full"
            value={difficulty}
            options={difficultyOptions}
            placeholder="Sélectionner une difficulté"
            showClear
            onChange={(event) =>
              setDifficulty(event.value ?? '')
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

            {ingredientRows.map((row, index) => (
              <div
                key={row.key}
                className="grid align-items-end"
              >
                <div className="col-12 md:col-5">
                  <label
                    htmlFor={`ingredient-${row.key}`}
                    className="block mb-2"
                  >
                    Ingrédient {index + 1}
                  </label>

                  <Dropdown
                    inputId={`ingredient-${row.key}`}
                    className="w-full"
                    value={row.ingredientId}
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
                    htmlFor={`quantity-${row.key}`}
                    className="block mb-2"
                  >
                    Quantité
                  </label>

                  <InputNumber
                    inputId={`quantity-${row.key}`}
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
                    htmlFor={`unit-${row.key}`}
                    className="block mb-2"
                  >
                    Unité
                  </label>

                  <InputText
                    id={`unit-${row.key}`}
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
                      removeIngredientRow(row.key)
                    }
                  />
                </div>
              </div>
            ))}

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
              maxFileSize={5 * 1024 * 1024}
              chooseLabel={
                selectedImage
                  ? 'Changer l’image'
                  : 'Choisir une image'
              }
              customUpload
              auto={false}
              onSelect={handleImageSelect}
            />

            {selectedImage && (
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
                onClick={removeSelectedImage}
              />
            )}
          </div>

          <small className="block mt-2 text-600">
            Formats acceptés : JPG, PNG et WebP. Taille
            maximale : 5 Mo.
          </small>
        </div>

        {imagePreviewUrl && (
          <div>
            <span className="block mb-2">
              Aperçu
            </span>

            <img
              src={imagePreviewUrl}
              alt="Aperçu de la recette"
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
              isSubmitting || uploadingImage
            }
            onClick={() => navigate('/recettes')}
          />

          <Button
            type="submit"
            label={
              uploadingImage
                ? 'Envoi de l’image...'
                : 'Créer la recette'
            }
            icon="pi pi-check"
            loading={
              isSubmitting || uploadingImage
            }
          />
        </div>
      </form>
    </Card>
  );
}

export default CreateRecipePage;