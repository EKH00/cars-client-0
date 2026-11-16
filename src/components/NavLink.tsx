import { NavLink } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';

export function NavLinkComponent() {

    const favoriteCount =
        useCarUiStore(
            (state) =>
                state.favoriteCarIds.length,
        );

  return (
    <nav className="site-nav" aria-label="Nawigacja główna">
      <span className="site-nav-brand">CarsWebApp</span>
      <span className="favorite-counter">
        Ulubione: {favoriteCount}
      </span>
      <div className="site-nav-links">
        <NavLink to="/" end>
          Strona główna
        </NavLink>
        <NavLink to="/cars">
          Samochody
        </NavLink>
        <NavLink to="/cars/new" end>
          Dodaj samochód
        </NavLink>
      </div>
    </nav>
  );
}