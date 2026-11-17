import {
    useState,
    type ChangeEvent,
    type SyntheticEvent,
} from 'react';

import {
    Link,
    useNavigate,
} from 'react-router';

import {
    register,
} from '../services/authService';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [userName, setUsername] =
        useState('');
    const [email, setEmail] =
        useState('');
    const [password, setPassword] =
        useState('');
    const [error, setError] =
        useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    function handleUsernameChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        setUsername(event.target.value);
    }

    function handleEmailChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        setPassword(event.target.value);
    }

    async function handleSubmit(
        event: SyntheticEvent<HTMLFormElement>,
    ) {
        event.preventDefault();
        try {
            setIsSubmitting(true);
            setError(null);
            const message = await register({
                userName,
                email,
                password,
            });
            alert(message);
            navigate('/confirm-email');
        }
        catch (caughtError) {
            if (caughtError instanceof Error) {
                setError(caughtError.message);
            }
            else {
                setError(
                    'Nie udało się zarejestrować.',
                );
            }
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section>
            <h1>Rejestracja</h1>
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
                    Nazwa użytkownika
                    <input
                        type="text"
                        value={userName}
                        onChange={handleUsernameChange}
                        required
                    />
                </label>
                <label>
                    E-mail
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </label>
                <label>
                    Hasło
                    <input
                        type="password"
                        value={password}
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
                            ? 'Rejestracja...'
                            : 'Zarejestruj się'}
                    </button>
                </div>
            </form>
            <p>
                <Link to="/forgot-password">
                    Nie pamiętasz hasła?
                </Link>
            </p>
            <p>
                Masz już konto?{' '}
                <Link to="/login">
                    Zaloguj się
                </Link>
            </p>
        </section>
    );
}