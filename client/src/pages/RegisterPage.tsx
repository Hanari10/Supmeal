import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

import { register } from '../services/authService';
import { useToast } from '../hooks/useToast';

function RegisterPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (password !== confirmPassword) {
      showError(
        'Mot de passe',
        'Les mots de passe sont différents.',
      );

      return;
    }

    try {
      setLoading(true);

      await register({
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });

      showSuccess(
        'Compte créé',
        'Vous pouvez maintenant vous connecter.',
      );

      navigate('/connexion');
    } catch {
      showError(
        'Inscription impossible',
        'Cette adresse email est peut-être déjà utilisée.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-content-center align-items-center min-h-screen">
      <Card
        title="Créer un compte"
        className="w-full md:w-30rem"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-column gap-3"
        >
          <div className="grid">
            <div className="col">
              <label className="block mb-2">
                Prénom
              </label>

              <InputText
                className="w-full"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
              />
            </div>

            <div className="col">
              <label className="block mb-2">
                Nom
              </label>

              <InputText
                className="w-full"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">
              Adresse email
            </label>

            <InputText
              className="w-full"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div>
            <label className="block mb-2">
              Mot de passe
            </label>

            <Password
              className="w-full"
              inputClassName="w-full"
              toggleMask
              feedback
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <div>
            <label className="block mb-2">
              Confirmation
            </label>

            <Password
              className="w-full"
              inputClassName="w-full"
              toggleMask
              feedback={false}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
            />
          </div>

          <Button
            type="submit"
            label="Créer mon compte"
            icon="pi pi-user-plus"
            loading={loading}
          />
        </form>

        <Divider />

        <div className="text-center">
          <span className="block mb-2">
            Déjà inscrit ?
          </span>

          <Button
            label="Se connecter"
            icon="pi pi-sign-in"
            severity="secondary"
            outlined
            onClick={() => navigate('/connexion')}
          />
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;