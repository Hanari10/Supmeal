import { useAuth } from '../hooks/useAuth';

function HomePage() {
  const { user } = useAuth();

  return (
    <main>
      <h1>SUPMEAL</h1>
      <p>Bienvenue sur l’application.</p>
      <p>Utilisateur connecté : {user?.email}</p>
    </main>
  );
}

export default HomePage;