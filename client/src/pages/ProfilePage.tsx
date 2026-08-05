import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Chips } from 'primereact/chips';
import { Divider } from 'primereact/divider';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { ProgressSpinner } from 'primereact/progressspinner';
import { TabPanel, TabView } from 'primereact/tabview';

import {
  changePassword,
  getFullProfile,
  updateProfile,
} from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showError, showSuccess } = useToast();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [defaultServings, setDefaultServings] = useState(1);

  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(
    [],
  );
  const [allergies, setAllergies] = useState<string[]>([]);
  const [preferredCuisines, setPreferredCuisines] = useState<string[]>(
    [],
  );

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    let isCancelled = false;

    getFullProfile()
      .then((profile) => {
        if (isCancelled) {
          return;
        }

        setEmail(profile.email);
        setFirstName(profile.firstName ?? '');
        setLastName(profile.lastName ?? '');
        setDefaultServings(profile.defaultServings ?? 1);
        setDietaryPreferences(profile.dietaryPreferences ?? []);
        setAllergies(profile.allergies ?? []);
        setPreferredCuisines(profile.preferredCuisines ?? []);
      })
      .catch(() => {
        if (!isCancelled) {
          showError(
            'Chargement impossible',
            'Impossible de récupérer votre profil.',
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
  }, [showError]);

  async function handleProfileSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSavingProfile(true);

      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        defaultServings,
        dietaryPreferences,
        allergies,
        preferredCuisines,
      });

      showSuccess(
        'Profil modifié',
        'Vos informations ont été enregistrées.',
      );
    } catch {
      showError(
        'Modification impossible',
        'Votre profil n’a pas pu être enregistré.',
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      showError(
        'Mots de passe différents',
        'La confirmation ne correspond pas au nouveau mot de passe.',
      );
      return;
    }

    if (newPassword.length < 8) {
      showError(
        'Mot de passe trop court',
        'Le nouveau mot de passe doit contenir au moins 8 caractères.',
      );
      return;
    }

    try {
      setSavingPassword(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      showSuccess(
        'Mot de passe modifié',
        'Votre nouveau mot de passe est maintenant actif.',
      );
    } catch {
      showError(
        'Modification impossible',
        'Le mot de passe actuel est peut-être incorrect.',
      );
    } finally {
      setSavingPassword(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/connexion');
  }

  if (loading) {
    return (
      <div className="flex justify-content-center p-6">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-column gap-4">
      <div>
        <h1 className="mb-2">Mon profil</h1>

        <p className="mt-0 text-600">
          Gérez vos informations personnelles et vos préférences.
        </p>
      </div>

      <Card>
        <TabView>
          <TabPanel header="Informations" leftIcon="pi pi-user mr-2">
            <form
              className="flex flex-column gap-4"
              onSubmit={handleProfileSubmit}
            >
              <div>
                <label htmlFor="profile-email" className="block mb-2">
                  Adresse email
                </label>

                <InputText
                  id="profile-email"
                  className="w-full"
                  value={email}
                  disabled
                />
              </div>

              <div className="grid">
                <div className="col-12 md:col-6">
                  <label
                    htmlFor="profile-first-name"
                    className="block mb-2"
                  >
                    Prénom
                  </label>

                  <InputText
                    id="profile-first-name"
                    className="w-full"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(event.target.value)
                    }
                  />
                </div>

                <div className="col-12 md:col-6">
                  <label
                    htmlFor="profile-last-name"
                    className="block mb-2"
                  >
                    Nom
                  </label>

                  <InputText
                    id="profile-last-name"
                    className="w-full"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(event.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-servings"
                  className="block mb-2"
                >
                  Nombre de portions par défaut
                </label>

                <InputNumber
                  inputId="profile-servings"
                  className="w-full"
                  value={defaultServings}
                  min={1}
                  max={50}
                  showButtons
                  onValueChange={(event) =>
                    setDefaultServings(event.value ?? 1)
                  }
                />
              </div>

              <Divider />

              <div>
                <label className="block mb-2">
                  Préférences alimentaires
                </label>

                <Chips
                  className="w-full"
                  value={dietaryPreferences}
                  separator=","
                  placeholder="Ex. végétarien, riche en protéines"
                  onChange={(event) =>
                    setDietaryPreferences(event.value ?? [])
                  }
                />

                <small className="text-600">
                  Appuyez sur Entrée après chaque préférence.
                </small>
              </div>

              <div>
                <label className="block mb-2">Allergies</label>

                <Chips
                  className="w-full"
                  value={allergies}
                  separator=","
                  placeholder="Ex. arachides, lactose"
                  onChange={(event) =>
                    setAllergies(event.value ?? [])
                  }
                />
              </div>

              <div>
                <label className="block mb-2">
                  Cuisines préférées
                </label>

                <Chips
                  className="w-full"
                  value={preferredCuisines}
                  separator=","
                  placeholder="Ex. italienne, japonaise"
                  onChange={(event) =>
                    setPreferredCuisines(event.value ?? [])
                  }
                />
              </div>

              <div>
                <Button
                  type="submit"
                  label="Enregistrer mon profil"
                  icon="pi pi-save"
                  loading={savingProfile}
                />
              </div>
            </form>
          </TabPanel>

          <TabPanel
            header="Mot de passe"
            leftIcon="pi pi-lock mr-2"
          >
            <form
              className="flex flex-column gap-4"
              onSubmit={handlePasswordSubmit}
            >
              <div>
                <label
                  htmlFor="current-password"
                  className="block mb-2"
                >
                  Mot de passe actuel
                </label>

                <Password
                  inputId="current-password"
                  className="w-full"
                  inputClassName="w-full"
                  value={currentPassword}
                  feedback={false}
                  toggleMask
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block mb-2"
                >
                  Nouveau mot de passe
                </label>

                <Password
                  inputId="new-password"
                  className="w-full"
                  inputClassName="w-full"
                  value={newPassword}
                  feedback
                  toggleMask
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2"
                >
                  Confirmer le nouveau mot de passe
                </label>

                <Password
                  inputId="confirm-password"
                  className="w-full"
                  inputClassName="w-full"
                  value={confirmPassword}
                  feedback={false}
                  toggleMask
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                />
              </div>

              <div>
                <Button
                  type="submit"
                  label="Modifier mon mot de passe"
                  icon="pi pi-lock"
                  loading={savingPassword}
                />
              </div>
            </form>
          </TabPanel>

          <TabPanel
            header="Session"
            leftIcon="pi pi-sign-out mr-2"
          >
            <p>
              Déconnectez-vous de votre compte sur cet appareil.
            </p>

            <Button
              label="Se déconnecter"
              icon="pi pi-sign-out"
              severity="danger"
              outlined
              onClick={handleLogout}
            />
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
}

export default ProfilePage;