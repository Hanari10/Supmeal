import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProgressSpinner } from 'primereact/progressspinner';

import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { completeOAuthLogin } = useAuth();
  const { showError, showSuccess } = useToast();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    const hashParams = new URLSearchParams(
      window.location.hash.replace(/^#/, ''),
    );
    const accessToken = hashParams.get('token');

    // Retire immédiatement le JWT de l'URL visible et de l'historique.
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname,
    );

    if (!accessToken) {
      showError(
        'Connexion Google impossible',
        "Aucun jeton d'authentification n'a été reçu.",
      );
      navigate('/connexion', { replace: true });
      return;
    }

    void completeOAuthLogin(accessToken)
      .then(() => {
        showSuccess(
          'Connexion réussie',
          'Bienvenue sur SUPMEAL.',
        );
        navigate('/', { replace: true });
      })
      .catch(() => {
        showError(
          'Connexion Google impossible',
          "Le compte Google n'a pas pu être authentifié.",
        );
        navigate('/connexion', { replace: true });
      });
  }, [
    completeOAuthLogin,
    navigate,
    showError,
    showSuccess,
  ]);

  return (
    <div className="flex flex-column justify-content-center align-items-center min-h-screen surface-ground gap-3">
      <ProgressSpinner />
      <span>Connexion avec Google en cours...</span>
    </div>
  );
}

export default OAuthCallbackPage;