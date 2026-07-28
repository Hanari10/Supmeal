import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/connexion');
  }

  return (
    <main>
      <h1>Profil</h1>

      <p>Email : {user?.email}</p>

      <button type="button" onClick={handleLogout}>
        Se déconnecter
      </button>
    </main>
  );
}

export default ProfilePage;