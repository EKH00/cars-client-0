import {
    Navigate,
    Outlet,
} from 'react-router';

import {
    useAuthStore,
} from '../store/useAuthStore';

export default function AdminRoute() {
    const user =
        useAuthStore(
            (state) => state.user,
        );

    const isAdmin =
        user?.roles.includes('Admin')
            ?? false;

    if (!user || !isAdmin) {
        return (
            <Navigate
                to="/accessDenied"
                replace
            />
        );
    }

    return <Outlet />;
}