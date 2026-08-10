import { useState } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Sidebar } from 'primereact/sidebar';

import { useAuth } from '../../hooks/useAuth';

interface NavigationItem {
  label: string;
  icon: string;
  path: string;
}

interface NavigationContentProps {
  userEmail?: string;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Tableau de bord',
    icon: 'pi pi-home',
    path: '/',
  },
  {
    label: 'Ingrédients',
    icon: 'pi pi-box',
    path: '/ingredients',
  },
  {
    label: 'Recettes',
    icon: 'pi pi-book',
    path: '/recettes',
  },
  {
    label: 'Nouvelle recette',
    icon: 'pi pi-plus',
    path: '/recettes/nouvelle',
  },
  {
    label: 'Favoris',
    icon: 'pi pi-heart',
    path: '/favoris',
  },
  {
    label: 'Planning',
    icon: 'pi pi-calendar',
    path: '/planning',
  },
  {
    label: 'Liste de courses',
    icon: 'pi pi-shopping-cart',
    path: '/liste-de-courses',
  },
  {
    label: 'Cookbooks',
    icon: 'pi pi-users',
    path: '/cookbooks',
  },
  {
    label: 'Import / Export',
    icon: 'pi pi-file-export',
    path: '/import-export',
  },
  {
    label: 'Profil',
    icon: 'pi pi-user',
    path: '/profil',
  },
];

function isActivePath(
  currentPath: string,
  itemPath: string,
) {
  if (itemPath === '/') {
    return currentPath === '/';
  }

  return currentPath.startsWith(itemPath);
}

function NavigationContent({
  userEmail,
  currentPath,
  onNavigate,
  onLogout,
}: NavigationContentProps) {
  return (
    <div className="flex flex-column min-h-full w-full">
      <div>
        <h2 className="mt-0 mb-1">
          SUPMEAL
        </h2>

        <span className="text-600 text-sm">
          Gestion de recettes et de repas
        </span>
      </div>

      <Divider />

      <div className="flex flex-column gap-2">
        {navigationItems.map((item) => {
          const active = isActivePath(
            currentPath,
            item.path,
          );

          return (
            <Button
              key={item.path}
              label={item.label}
              icon={item.icon}
              severity={
                active
                  ? undefined
                  : 'secondary'
              }
              text={!active}
              className="w-full justify-content-start"
              onClick={() =>
                onNavigate(item.path)
              }
            />
          );
        })}
      </div>

      <div className="mt-auto pt-3">
        <Divider />

        <div className="mb-3">
          <span className="block text-600 text-sm mb-1">
            Utilisateur connecté
          </span>

          <strong
            className="text-sm"
            style={{
              overflowWrap: 'anywhere',
            }}
          >
            {userEmail ?? 'Utilisateur'}
          </strong>
        </div>

        <Button
          label="Déconnexion"
          icon="pi pi-sign-out"
          severity="danger"
          outlined
          className="w-full"
          onClick={onLogout}
        />
      </div>
    </div>
  );
}

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [
    mobileMenuVisible,
    setMobileMenuVisible,
  ] = useState(false);

  function handleNavigation(path: string) {
    navigate(path);
    setMobileMenuVisible(false);
  }

  function handleLogout() {
    logout();
    navigate('/connexion');
  }

  return (
    <div className="min-h-screen surface-ground">
      <header className="md:hidden flex align-items-center justify-content-between p-3 surface-card border-bottom-1 surface-border">
        <strong>SUPMEAL</strong>

        <Button
          icon="pi pi-bars"
          rounded
          text
          aria-label="Ouvrir le menu"
          onClick={() =>
            setMobileMenuVisible(true)
          }
        />
      </header>

      <Sidebar
        visible={mobileMenuVisible}
        onHide={() =>
          setMobileMenuVisible(false)
        }
        className="w-18rem"
      >
        <div
          style={{
            minHeight: '100%',
          }}
        >
          <NavigationContent
            userEmail={user?.email}
            currentPath={
              location.pathname
            }
            onNavigate={
              handleNavigation
            }
            onLogout={handleLogout}
          />
        </div>
      </Sidebar>

      <aside
        className="hidden md:flex fixed left-0 top-0 h-screen surface-card border-right-1 surface-border p-3 overflow-y-auto"
        style={{
          width: '270px',
        }}
      >
        <NavigationContent
          userEmail={user?.email}
          currentPath={
            location.pathname
          }
          onNavigate={
            handleNavigation
          }
          onLogout={handleLogout}
        />
      </aside>

      <main
        className="p-3 md:p-5"
        style={{
          marginLeft:
            'var(--supmeal-sidebar-offset)',
        }}
      >
        <style>
          {`
            :root {
              --supmeal-sidebar-offset: 0;
            }

            @media (min-width: 768px) {
              :root {
                --supmeal-sidebar-offset: 270px;
              }
            }
          `}
        </style>

        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;