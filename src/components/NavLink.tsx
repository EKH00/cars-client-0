import { NavLink, useNavigate } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';
import { useAuthStore } from '../store/useAuthStore';

export function NavLinkComponent() {

  const navigate = useNavigate();

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const isAdmin =
    user?.roles.includes('Admin')
      ?? false;


  const logout =
    useAuthStore(
      (state) => state.logout,
    );

  function handleLogout() {
    logout();
    navigate('/login')
  }

  const favoriteCount =
    useCarUiStore(
      (state) =>
        user
          ? (
            state.favoriteCarIdsByUser[
              user.id
            ] ?? []
          ).length
            : 0,
    );

  return (
    <nav className="site-nav" aria-label="Nawigacja główna">
      <span className="site-nav-brand">CarsWebApp</span>


      <div className="site-nav-links">

        <NavLink to="/" end>
          Strona główna
        </NavLink>
        
        {user && (
          <>

            <NavLink to="/cars">
              Samochody
            </NavLink>

            {isAdmin && (
              <NavLink to="/cars/new" end>
                Dodaj samochód
              </NavLink>
            )}

          </>
        )}

        
        <NavLink to="/about">
          O aplikacji
        </NavLink>

        {user ? (
          <>
            <span className="favorite-counter">
              Ulubione: {favoriteCount}
            </span>
            <span className="user-info">
              {user.userName}
              {' ('}
              {user.roles.join(', ')}
              {')'}
            </span>
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Wyloguj
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">
              Logowanie
            </NavLink>
            <NavLink to="/register">
              Rejestracja
            </NavLink>
          </>
        )}

      </div>
    </nav>
  );
}