import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showError, showSuccess } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function handleGoogleLogin(): void {
    window.location.href = 'http://localhost:3000/auth/google';
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setLoading(true);

      await login({
        email: email.trim(),
        password,
      });

      showSuccess(
        'Connexion réussie',
        'Bienvenue sur SUPMEAL.',
      );

      navigate('/');
    } catch {
      showError(
        'Connexion impossible',
        'Adresse email ou mot de passe incorrect.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-content-center align-items-center min-h-screen surface-ground p-3">
      <Card
        title="Connexion"
        subTitle="Accédez à votre espace SUPMEAL"
        className="w-full md:w-30rem"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-column gap-3"
        >
          <div>
            <label
              htmlFor="login-email"
              className="block mb-2"
            >
              Adresse email
            </label>

            <InputText
              id="login-email"
              className="w-full"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block mb-2"
            >
              Mot de passe
            </label>

            <Password
              inputId="login-password"
              className="w-full"
              inputClassName="w-full"
              value={password}
              feedback={false}
              toggleMask
              autoComplete="current-password"
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <Button
            type="submit"
            label="Se connecter"
            icon="pi pi-sign-in"
            loading={loading}
          />
        </form>

        <Divider align="center">
          <span className="text-color-secondary">ou</span>
        </Divider>

        <Button
          type="button"
          label="Continuer avec Google"
          icon="pi pi-google"
          severity="secondary"
          outlined
          className="w-full"
          onClick={handleGoogleLogin}
        />

        <Divider />

        <div className="text-center">
          <span className="block mb-2">
            Pas encore de compte ?
          </span>

          <Button
            label="Créer un compte"
            icon="pi pi-user-plus"
            severity="secondary"
            outlined
            onClick={() => navigate('/inscription')}
          />
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;