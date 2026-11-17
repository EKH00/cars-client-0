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
    forgotPassword,
} from '../services/authService';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] =
        useState('');
    const [error, setError] =
        useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    function handleEmailChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        setEmail(event.target.value);
    }

    async function handleSubmit(
        event: SyntheticEvent<HTMLFormElement>,
    ) {
        event.preventDefault();
        try {
            setIsSubmitting(true);
            setError(null);
            await forgotPassword(
                email,
            );
            alert(
                'Email z linkiem do resetowania hasła został wysłany.',
            );
            navigate('/login');
        }
        catch (caughtError) {
            if (caughtError instanceof Error) {
                setError(caughtError.message);
            }
            else {
                setError(
                    'Nie udało się wysłać emaila z linkiem do resetowania hasła.',
                );
            }
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section>
            <h1>Zapomniałxm hasła</h1>
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
                    E-mail
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </label>
                <div className='car-form-actions'>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Wysyłanie emaila...'
                            : 'Wyślij email z linkiem do resetowania hasła'}
                    </button>
                </div>
            </form>
            <p>
                Nie masz konta?{' '}
                <Link to="/register">
                    Zarejestruj się
                </Link>
            </p>
        </section>
    );
}