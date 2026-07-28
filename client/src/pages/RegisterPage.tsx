import { Link } from 'react-router-dom';

function RegisterPage() {
  return (
    <main>
      <h1>Inscription</h1>

      <p>
        Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
      </p>
    </main>
  );
}

export default RegisterPage;