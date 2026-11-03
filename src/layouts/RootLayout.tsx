import { Outlet, NavLink } from 'react-router';

export default function RootLayout() {
  return (
    <>
      <nav>
        <NavLink to="/">Strona główna</NavLink>
      </nav>
      <nav>
        <NavLink to="/cars">Samochody</NavLink>
      </nav>
      <nav>
        <NavLink to="/cars/new">Dodaj samochód</NavLink>
      </nav>
      <main className="page">
        <Outlet />
      </main>
    </>
  );
}