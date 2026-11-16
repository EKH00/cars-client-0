import { Outlet } from 'react-router';
import { NavLinkComponent } from '../components/NavLink';

export default function RootLayout() {
  return (
    <>
      <header>
        <NavLinkComponent />
      </header>

      <main className="page">
        <Outlet />
      </main>
    </>
  );
}