// import {
//     useState,
//     type ChangeEvent,
//     type SyntheticEvent,
// } from 'react';

// import {
//     useLocation,
//     useNavigate,
// } from 'react-router';

// import {
//     resetPassword,
// } from '../services/authService';

// export default function ResetPasswordPage() {

//     const { search } = useLocation();
//     const searchParams = new URLSearchParams(search);
//     const email = searchParams.get('email');
//     const token = searchParams.get('token');
    
//     const navigate = useNavigate();

//     const [newPassword, setNewPassword] =
//         useState('');
//     const [error, setError] =
//         useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] =
//         useState(false);

//     function handlePasswordChange(
//         event: ChangeEvent<HTMLInputElement>,
//     ) {
//         setNewPassword(event.target.value);
//     }

//     async function handleSubmit(
//         event: SyntheticEvent<HTMLFormElement>,
//     ) {
//         event.preventDefault();
//         try {
//             setIsSubmitting(true);
//             setError(null);
            
//             if (email === null || token === null) {
//                 setError('The password reset link is invalid.');
//                 return;
//             }
//             const message = await resetPassword(
//                 email,
//                 token,
//                 newPassword
//             );
//             alert(message);
//             navigate('/login');
//         }
//         catch (caughtError) {
//             if (caughtError instanceof Error) {
//                 setError(caughtError.message);
//             }
//             else {
//                 setError(
//                     'Nie udało się zresetować hasła.',
//                 );
//             }
//         }
//         finally {
//             setIsSubmitting(false);
//         }
//     }
    
//     if (!email || !token) {
//         return (
//             <p className="error-message">
//                 Nieprawidłowy link do resetowania hasła.
//             </p>
//         );
//     }

//     return (
//         <section>
//             <h1>Reset hasła</h1>
//             {error && (
//                 <p className="error-message">
//                     {error}
//                 </p>
//             )}
//             <form
//                 className="car-form"
//                 onSubmit={handleSubmit}
//             >
//                 <label>
//                     E-mail
//                     <p>{email}</p>
//                 </label>
//                 <label>
//                     Nowe hasło:
//                     <input
//                         type="password"
//                         value={newPassword}
//                         onChange={handlePasswordChange}
//                         required
//                     />
//                 </label>
//                 <button
//                     type="submit"
//                     disabled={isSubmitting}
//                 >
//                     {isSubmitting
//                         ? 'Resetowanie hasła...'
//                         : 'Zresetuj hasło'}
//                 </button>
//             </form>
//         </section>
//     );
// }

import {
    useState,
    type ChangeEvent,
    type SyntheticEvent,
} from 'react';

import {
    Link,
    useSearchParams,
} from 'react-router';

import {
    resetPassword,
} from '../services/authService';

export default function ResetPasswordPage() {
    const [searchParams] =
        useSearchParams();

    const email =
        searchParams.get('email');

    const token =
        searchParams.get('token');

    const [newPassword, setNewPassword] =
        useState('');

    const [message, setMessage] =
        useState<string | null>(null);

    const [error, setError] =
        useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    function handlePasswordChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        setNewPassword(event.target.value);
    }

    async function handleSubmit(
        event: SyntheticEvent<HTMLFormElement>,
    ) {
        event.preventDefault();
        if (!email || !token) {
            return;
        }
        try {
            setIsSubmitting(true);
            setError(null);
            const result =
            await resetPassword(
                email,
                token,
                newPassword,
            );
            setMessage(result);
        }
        catch (caughtError) {
            if (caughtError instanceof Error) {
                setError(caughtError.message);
            }
            else {
                setError(
                    'Nie udało się zmienić hasła.',
                );
            }
        }
        finally {
            setIsSubmitting(false);
        }
    }
    if (!email || !token) {
        return (
            <section>
                <h1>Nieprawidłowy link</h1>
                <Link to="/login">
                    Wróć do logowania
                </Link>
            </section>
        );
    }
    return (
        <section>
            <h1>Ustaw nowe hasło</h1>
            {message && <p>{message}</p>}
            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}
            <form
                className="car-form"
                onSubmit={handleSubmit}
            >
                <label>
                    Nowe hasło
                    <input
                        type="password"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        required
                    />
                </label>
                <div className='car-form-actions'>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Zapisywanie...'
                            : 'Zmień hasło'}
                    </button>
                </div>
            </form>
        </section>
    );
}