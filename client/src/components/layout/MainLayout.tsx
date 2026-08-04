import { Outlet, useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { PanelMenu } from 'primereact/panelmenu';

function MainLayout() {
  const navigate = useNavigate();

  const items = [
    {
      label: 'Tableau de bord',
      icon: 'pi pi-home',
      command: () => navigate('/'),
    },
    {
      label: 'Recettes',
      icon: 'pi pi-book',
      command: () => navigate('/recettes'),
    },
    {
      label: 'Nouvelle recette',
      icon: 'pi pi-plus',
      command: () => navigate('/recettes/nouvelle'),
    },
    {
      label: 'Liste de courses',
      icon: 'pi pi-shopping-cart',
      command: () => navigate('/liste-de-courses'),
    },
    {
      label: 'Ingrédients',
      icon: 'pi pi-box',
      command: () => navigate('/ingredients'),
    },
    {
      label: 'Profil',
      icon: 'pi pi-user',
      command: () => navigate('/profil'),
    },
  ];

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <aside
        style={{
          width: '270px',
          padding: '1rem',
          borderRight: '1px solid #dcdcdc',
          background: '#f8f9fa',
        }}
      >
        <h2 style={{ marginTop: 0 }}>🍽️ SUPMEAL</h2>

        <Divider />

        <PanelMenu model={items} />

        <Divider />

        <Button
          label="Déconnexion"
          icon="pi pi-sign-out"
          severity="danger"
          outlined
          className="w-full"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/connexion');
          }}
        />
      </aside>

      <main
        style={{
          flex: 1,
          padding: '2rem',
          background: '#ffffff',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;