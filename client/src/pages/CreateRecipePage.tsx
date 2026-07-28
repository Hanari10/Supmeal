import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../services/recipeService';

function CreateRecipePage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preparationTime, setPreparationTime] = useState(0);
  const [cookingTime, setCookingTime] = useState(0);
  const [difficulty, setDifficulty] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      await createRecipe({
        name,
        description: description || undefined,
        preparationTime,
        cookingTime,
        servings,
        difficulty: difficulty || undefined,
        imageUrl: imageUrl || undefined,
      });

      navigate('/recettes');
    } catch (error) {
      console.error(error);
      setError('Impossible de créer la recette.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Nouvelle recette</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom</label>
          <br />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="description">Description</label>
          <br />
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="preparationTime">
            Temps de préparation en minutes
          </label>
          <br />
          <input
            id="preparationTime"
            type="number"
            min="0"
            value={preparationTime}
            onChange={(event) =>
              setPreparationTime(Number(event.target.value))
            }
          />
        </div>

        <br />

        <div>
          <label htmlFor="cookingTime">Temps de cuisson en minutes</label>
          <br />
          <input
            id="cookingTime"
            type="number"
            min="0"
            value={cookingTime}
            onChange={(event) => setCookingTime(Number(event.target.value))}
          />
        </div>

        <br />

        <div>
          <label htmlFor="difficulty">Difficulté</label>
          <br />
          <input
            id="difficulty"
            type="text"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
          />
        </div>

        <br />

        <div>
          <label htmlFor="imageUrl">URL de l’image</label>
          <br />
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
        </div>

        <br />

        <div>
          <label htmlFor="servings">Nombre de portions</label>
          <br />
          <input
            id="servings"
            type="number"
            min="1"
            value={servings}
            onChange={(event) => setServings(Number(event.target.value))}
            required
          />
        </div>

        <br />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Création...' : 'Créer la recette'}
        </button>
      </form>

      {error && <p>{error}</p>}
    </main>
  );
}

export default CreateRecipePage;