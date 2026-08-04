import { Outlet, useNavigate } from 'react-router-dom';

import { PanelMenu } from 'primereact/panelmenu';

function AppLayout() {
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
      label: 'Planning',
      icon: 'pi pi-calendar',
      command: () => navigate('/meal-plans'),
    },
    {
      label: 'Liste de courses',
      icon: 'pi pi-shopping-cart',
      command: () => navigate('/shopping-list'),
    },
    {
      label: 'Cookbooks',
      icon: 'pi pi-users',
      command: () => navigate('/cookbooks'),
    },
    {
      label: 'Favoris',
      icon: 'pi pi-heart',
      command: () => navigate('/favorites'),
    },
  ];

  return (
    <div className="grid min-h-screen">

      <div className="col-12 md:col-3 lg:col-2 surface-100">

        <h2 className="text-center">
          SUPMEAL
        </h2>

        <PanelMenu model={items} />

      </div>

      <div className="col p-4">

        <Outlet />

      </div>

    </div>
  );
}

export default AppLayout;