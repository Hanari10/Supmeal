import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Bienvenue sur SUPMEAL</h1>

      <p>Gérez facilement vos recettes, vos repas et vos listes de courses.</p>

      <div
        className="grid"
        style={{
          marginTop: '2rem',
        }}
      >
        <div className="col-12 md:col-6 xl:col-3">
          <Card title="📖 Recettes">
            <p>Créer et organiser vos recettes.</p>

            <Button
              className="w-full"
              label="Ouvrir"
              onClick={() => navigate('/recettes')}
            />
          </Card>
        </div>

        <div className="col-12 md:col-6 xl:col-3">
          <Card title="🛒 Courses">
            <p>Consulter votre liste de courses.</p>

            <Button
              className="w-full"
              label="Ouvrir"
              onClick={() => navigate('/liste-de-courses')}
            />
          </Card>
        </div>

        <div className="col-12 md:col-6 xl:col-3">
          <Card title="🥕 Ingrédients">
            <p>Gérer vos ingrédients.</p>

            <Button
              className="w-full"
              label="Ouvrir"
              onClick={() => navigate('/ingredients')}
            />
          </Card>
        </div>

        <div className="col-12 md:col-6 xl:col-3">
          <Card title="👤 Profil">
            <p>Modifier votre profil.</p>

            <Button
              className="w-full"
              label="Ouvrir"
              onClick={() => navigate('/profil')}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

export default HomePage;