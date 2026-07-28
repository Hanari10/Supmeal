import { NavLink, Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/">Accueil</NavLink>
          {' | '}
          <NavLink to="/recettes">Recettes</NavLink>
          {' | '}
          <NavLink to="/liste-de-courses">Liste de courses</NavLink>
          {' | '}
          <NavLink to="/ingredients">Ingrédients</NavLink>
          {' | '}
          <NavLink to="/profil">Profil</NavLink>
        </nav>
      </header>

      <Outlet />
    </>
  );
}

export default MainLayout;